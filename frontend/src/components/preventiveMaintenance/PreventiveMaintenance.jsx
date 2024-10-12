import React, { useState, useEffect } from "react";
import axios from "axios";
import "./preventiveMaintenance.scss"; // Link to external SCSS
import * as XLSX from "xlsx"; // For Excel export

// Define possible statuses
const statusOptions = ["Pending", "Completed", "Skipped"];
const statusColors = {
  Pending: "#FFA500", // Orange for Pending
  Completed: "#4CAF50", // Green for Completed
  Skipped: "#FF0000", // Red for Skipped
};

// Helper function to calculate weeks based on PM frequency
const getMaintenanceWeeks = (pmFrequency) => {
  const maintenanceWeeks = [];

  switch (pmFrequency) {
    case "Annually":
      maintenanceWeeks.push(1); // Only one maintenance for the entire year
      break;
    case "Quarterly":
      maintenanceWeeks.push(1, 14, 27, 40); // Maintenance at weeks 1, 14, 27, and 40
      break;
    case "Monthly":
      for (let i = 0; i < 52; i += 4) {
        maintenanceWeeks.push(i + 1); // Every 4 weeks (roughly)
      }
      break;
    case "Weekly":
      for (let i = 1; i <= 52; i++) {
        maintenanceWeeks.push(i); // Every week
      }
      break;
    case "Daily":
      for (let i = 1; i <= 52; i++) {
        maintenanceWeeks.push(i); // Every week (for simplicity in the 52-week layout)
      }
      break;
    default:
      break;
  }

  return maintenanceWeeks;
};

const months = {
  JAN: { start: 1, end: 4 },
  FEB: { start: 5, end: 8 },
  MAR: { start: 9, end: 13 },
  APR: { start: 14, end: 17 },
  MAY: { start: 18, end: 21 },
  JUN: { start: 22, end: 26 },
  JUL: { start: 27, end: 30 },
  AUG: { start: 31, end: 35 },
  SEP: { start: 36, end: 39 },
  OCT: { start: 40, end: 43 },
  NOV: { start: 44, end: 48 },
  DEC: { start: 49, end: 52 },
};

const PreventiveMaintenance = () => {
  const [items, setItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/items");
        const filteredItems = response.data.filter((item) => item.pmNeeded === "Yes");
        setItems(filteredItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  const handleStatusChange = async (itemId, weekNumber, newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              maintenanceSchedule: item.maintenanceSchedule.map((week, index) =>
                index + 1 === weekNumber ? { ...week, status: newStatus } : week
              ),
            }
          : item
      )
    );

    try {
      await axios.put(`/api/items/${itemId}/schedule/update`, {
        weekNumber,
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating maintenance status:", err);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const filteredItems = selectedLocation === "All"
    ? items
    : items.filter((item) => item.location === selectedLocation);

  const locations = [...new Set(items.map((item) => item.location))];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "",
        "",
        "",
        "",
        "",
        "JAN", "", "", "",
        "FEB", "", "", "",
        "MAR", "", "", "", "",
        "APR", "", "", "",
        "MAY", "", "", "",
        "JUN", "", "", "", "",
        "JUL", "", "", "",
        "AUG", "", "", "", "",
        "SEP", "", "", "",
        "OCT", "", "", "",
        "NOV", "", "", "",
        "DEC", "", "", ""
      ],
      [
        "Item Name",
        "Category",
        "Specification",
        "Location", // Added Location column header
        "PM Frequency",
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12, 13,
        14, 15, 16, 17,
        18, 19, 20, 21,
        22, 23, 24, 25, 26,
        27, 28, 29, 30,
        31, 32, 33, 34, 35,
        36, 37, 38, 39,
        40, 41, 42, 43,
        44, 45, 46, 47, 48,
        49, 50, 51, 52
      ]
    ]);

    filteredItems.forEach(item => {
      const row = [
        item.itemName,
        item.category?.categoryName || "N/A",
        item.specification,
        item.location || "N/A", // Include location in the row
        item.pmFrequency,
        ...Array.from({ length: 52 }, (_, i) => item.maintenanceSchedule[i]?.status || "-")
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: -1 });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Preventive Maintenance");

    const merges = [
      { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }, 
      { s: { r: 0, c: 9 }, e: { r: 0, c: 12 } },
      { s: { r: 0, c: 13 }, e: { r: 0, c: 17 } },
      { s: { r: 0, c: 18 }, e: { r: 0, c: 21 } },
      { s: { r: 0, c: 22 }, e: { r: 0, c: 25 } },
      { s: { r: 0, c: 26 }, e: { r: 0, c: 30 } },
      { s: { r: 0, c: 31 }, e: { r: 0, c: 34 } },
      { s: { r: 0, c: 35 }, e: { r: 0, c: 39 } },
      { s: { r: 0, c: 40 }, e: { r: 0, c: 43 } },
      { s: { r: 0, c: 44 }, e: { r: 0, c: 47 } },
      { s: { r: 0, c: 48 }, e: { r: 0, c: 52 } },
      { s: { r: 0, c: 53 }, e: { r: 0, c: 56 } }
    ];

    worksheet["!merges"] = merges;

    XLSX.writeFile(workbook, "PreventiveMaintenance.xlsx");
  };

  const renderTable = () => {
    return (
      <table className="pm-table">
        <thead>
          <tr className="month-header">
            <th rowSpan={2}>Item Name</th>
            <th rowSpan={2}>Category</th>
            <th rowSpan={2}>Specification</th>
            <th rowSpan={2}>Location</th> {/* Added Location column */}
            <th rowSpan={2}>PM Frequency</th>
            {Object.keys(months).map((month) => (
              <th key={month} colSpan={months[month].end - months[month].start + 1}>
                {month}
              </th>
            ))}
          </tr>
          <tr className="week-header">
            {Array.from({ length: 52 }, (_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.category?.categoryName || "N/A"}</td>
              <td>{item.specification}</td>
              <td>{item.location || "N/A"}</td> {/* Added Location cell */}
              <td>{item.pmFrequency}</td>
              {Array.from({ length: 52 }, (_, i) => {
                const week = i + 1;
                const maintenanceWeeks = getMaintenanceWeeks(item.pmFrequency);
                const isMaintenanceWeek = maintenanceWeeks.includes(week);

                return (
                  <td key={week}>
                    {isMaintenanceWeek ? (
                      <select
                        style={{ backgroundColor: statusColors[item.maintenanceSchedule[week - 1]?.status || "Pending"] }}
                        value={item.maintenanceSchedule[week - 1]?.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(item._id, week, e.target.value)
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="preventiveMaintenance">
      <h3>Preventive Maintenance Schedule</h3>
      <div className="filter-export-container">
        <div className="location-filter">
          <label>Filter by Location: </label>
          <select onChange={handleLocationChange} value={selectedLocation}>
            <option value="All">All Locations</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="export-button">
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>
      </div>
      <div className="pmtable-container">
        {renderTable()}
      </div>
    </div>
  );
};

export default PreventiveMaintenance;

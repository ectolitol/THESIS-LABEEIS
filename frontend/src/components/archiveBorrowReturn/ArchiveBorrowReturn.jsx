import "./archiveBorrowReturn.scss";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { IconButton, Collapse, TextField, TableSortLabel } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";

const ArchiveBorrowReturn = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Longer table by default
  const [searchTerm, setSearchTerm] = useState("");
  const [openRow, setOpenRow] = useState({});
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dateTime");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/borrow-return");
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleToggleRow = (id) => {
    setOpenRow((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterAndGroupByDate = () => {
    const filteredRows = rows.filter((row) => {
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search by userName, transactionType, returnStatus, or date
      const matchesUserName = row.userName.toLowerCase().includes(searchTermLower);
      const matchesTransactionType = row.transactionType.toLowerCase().includes(searchTermLower);
      const matchesReturnStatus = row.returnStatus.toLowerCase().includes(searchTermLower);
      
      // Check if the search term matches the date (formatted as a string)
      const matchesDate = new Date(row.dateTime).toLocaleDateString().includes(searchTermLower);
      
      return matchesUserName || matchesTransactionType || matchesReturnStatus || matchesDate;
    });

    // Sort the filtered rows by the selected column and order
    const sortedFilteredRows = filteredRows.sort((a, b) => {
      if (orderBy === "dateTime") {
        return order === "asc"
          ? new Date(a.dateTime) - new Date(b.dateTime)
          : new Date(b.dateTime) - new Date(a.dateTime);
      } else if (orderBy === "userName") {
        return order === "asc"
          ? a.userName.localeCompare(b.userName)
          : b.userName.localeCompare(a.userName);
      } else if (orderBy === "transactionType") {
        return order === "asc"
          ? a.transactionType.localeCompare(b.transactionType)
          : b.transactionType.localeCompare(a.transactionType);
      } else if (orderBy === "returnStatus") {
        return order === "asc"
          ? a.returnStatus.localeCompare(b.returnStatus)
          : b.returnStatus.localeCompare(a.returnStatus);
      }
      return 0;
    });

    // Group the sorted rows by date
    const groupedRows = sortedFilteredRows.reduce((acc, row) => {
      const dateKey = new Date(row.dateTime).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(row);
      return acc;
    }, {});
    
    return groupedRows;
  };

  const sortedRows = filterAndGroupByDate();

  const calculateUniqueItemCount = (items) => {
    const itemsArray = items || [];
    return new Set(itemsArray.map((item) => item.itemName)).size;
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TextField
        label="Search Transactions"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearch}
        value={searchTerm}
      />
      <TableContainer sx={{ maxHeight: 700 }} className="table">
        <Table stickyHeader aria-label="archive borrow-return logs table">
          <TableHead>
            <TableRow>
              <TableCell className="column">
                <TableSortLabel
                  active={orderBy === "dateTime"}
                  direction={orderBy === "dateTime" ? order : "asc"}
                  onClick={() => handleSortRequest("dateTime")}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell className="column">
                <TableSortLabel
                  active={orderBy === "userName"}
                  direction={orderBy === "userName" ? order : "asc"}
                  onClick={() => handleSortRequest("userName")}
                >
                  User Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="column">
                <TableSortLabel
                  active={orderBy === "transactionType"}
                  direction={orderBy === "transactionType" ? order : "asc"}
                  onClick={() => handleSortRequest("transactionType")}
                >
                  Transaction Type
                </TableSortLabel>
              </TableCell>
              <TableCell className="column">Return Status</TableCell>
              <TableCell className="column">Items Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(sortedRows).map((date) => (
              <React.Fragment key={date}>
                <TableRow>
                  <TableCell colSpan={5} style={{ fontWeight: "bold" }}>
                    {date}
                  </TableCell>
                </TableRow>
                {sortedRows[date]
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <React.Fragment key={row._id}>
                      <TableRow hover>
                        <TableCell className="tableCell">
                          {new Date(row.dateTime).toLocaleString()}
                        </TableCell>
                        <TableCell className="tableCell">{row.userName}</TableCell>
                        <TableCell className="tableCell">{row.transactionType}</TableCell>
                        <TableCell className="tableCell">
                          <span className={`status ${row.returnStatus}`}>
                            {row.returnStatus}
                          </span>
                        </TableCell>
                        <TableCell className="tableCell">
                          {calculateUniqueItemCount(row.items || [])} Item/s
                          <IconButton
                            size="small"
                            onClick={() => handleToggleRow(row._id)}
                          >
                            {openRow[row._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={openRow[row._id]} timeout="auto" unmountOnExit>
                            <Table size="small" aria-label="items">
                              <TableBody>
                                <TableRow>
                                  <TableCell colSpan={7}><strong>Items:</strong></TableCell>
                                </TableRow>
                                {row.items && row.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>Item Name: {item.itemName}</TableCell>
                                    <TableCell>Barcode: {item.itemBarcode}</TableCell>
                                    <TableCell>Borrowed: {item.quantityBorrowed}</TableCell>
                                    <TableCell>Returned: {item.quantityReturned}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={7}><strong>Other Details:</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Course: {row.courseSubject}</TableCell>
                                  <TableCell>Professor: {row.professor}</TableCell>
                                  <TableCell>Prof Present? {row.profAttendance}</TableCell>
                                  <TableCell>Room: {row.roomNo}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ArchiveBorrowReturn;

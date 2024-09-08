import "./table.scss";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";

const BorrowReturnTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRow, setOpenRow] = useState({});

  // Fetch the logs from your backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/borrow-return"); // Change this to your actual API endpoint
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleRow = (id) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

// Calculate total unique items for each row based on itemName
const calculateUniqueItemCount = (items) => {
    // Use a Set to track unique item names
    const uniqueItems = new Set(items.map(item => item.itemName));
    return uniqueItems.size;
  };
  

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }} className="table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell className="column">Date & Time</TableCell>
              <TableCell className="column">User Name</TableCell>
              <TableCell className="column">Borrowed Duration</TableCell>
              <TableCell className="column">Transaction Type</TableCell>
              <TableCell className="column">Return Status</TableCell>
              <TableCell className="column">Items Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <React.Fragment key={row._id}>
                  <TableRow hover>
                    <TableCell className="tableCell">{new Date(row.dateTime).toLocaleString()}</TableCell>
                    <TableCell className="tableCell">{row.userName}</TableCell>
                    <TableCell className="tableCell">{row.borrowedDuration}</TableCell>
                    <TableCell className="tableCell">
                        <span className={`type ${row.transactionType}`}>{row.transactionType}</span>
                    </TableCell>
                    <TableCell className="tableCell">
                        <span className={`status ${row.returnStatus}`}>{row.returnStatus}</span>
                    </TableCell>
                    <TableCell className="tableCell">
                    {/* Display total unique items */}
                    {calculateUniqueItemCount(row.items)} Item/s
                    <IconButton
                        size="small"
                        onClick={() => handleToggleRow(row._id)}
                    >
                        {openRow[row._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Collapsible Row for Items */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={openRow[row._id]} timeout="auto" unmountOnExit>
                        <Table size="small" aria-label="items">
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={7}>
                                <strong>Items:</strong>
                              </TableCell>
                            </TableRow>
                            {row.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>Item Name: {item.itemName}</TableCell>
                                <TableCell>Barcode: {item.itemBarcode}</TableCell>
                                <TableCell>Borrowed: {item.quantityBorrowed}</TableCell>
                                <TableCell>Returned: {item.quantityReturned}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={7}>
                                <strong>Other Details:</strong>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Course: {row.courseSubject}</TableCell>
                              <TableCell>Professor: {row.professor}</TableCell>
                              <TableCell>Room: {row.roomNo}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
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

export default BorrowReturnTable;

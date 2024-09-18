import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, 
  TableSortLabel,
} from "@mui/material";

const ItemTransaction = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("dateTime");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/api/items/${itemId}`);
      setItem(response.data);
      fetchItemTransactions(response.data.itemBarcode);
    } catch (error) {
      console.error("Error fetching item details:", error.response ? error.response.data : error.message);
    }
  };

  const fetchItemTransactions = async (itemBarcode) => {
    try {
      const response = await axios.get(`/api/items/barcode/${itemBarcode}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching item transactions:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || "Error fetching item transactions");
    }
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTransactions = transactions.slice().sort((a, b) => {
    if (orderBy === "quantityBorrowed" || orderBy === "quantityReturned") {
      return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    } else {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!item) return <div>Loading item details...</div>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }} className="table">
        <Table stickyHeader aria-label="item transactions table">
          <TableHead>
            <TableRow>
              {[
                { id: "dateTime", label: "Date & Time" },
                { id: "userName", label: "User Name" },
                { id: "transactionType", label: "Transaction Type" },
                { id: "quantityBorrowed", label: "Quantity Borrowed" },
                { id: "quantityReturned", label: "Quantity Returned" },
                { id: "returnStatus", label: "Return Status" },
              ].map((column) => (
                <TableCell key={column.id} className="column">
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSortRequest(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    {transaction.items.map((item, index) => (
                      <TableRow hover key={`${transaction._id}-${index}`}>
                        <TableCell className="tableCell">
                          {new Date(transaction.dateTime).toLocaleString()}
                        </TableCell>
                        <TableCell className="tableCell">{transaction.userName}</TableCell>
                        <TableCell className="tableCell">
                          <span className={`type ${transaction.transactionType}`}>
                            {transaction.transactionType}
                          </span>
                        </TableCell>
                        <TableCell className="tableCell">{item.quantityBorrowed}</TableCell>
                        <TableCell className="tableCell">{item.quantityReturned}</TableCell>
                        <TableCell className="tableCell">
                          <span className={`status ${transaction.returnStatus}`}>
                            {transaction.returnStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }} >
                  No transactions found for this item.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ItemTransaction;

import { useState, useEffect } from 'react';
import axios from 'axios';
import "./widget.scss"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HomeRepairServiceRoundedIcon from '@mui/icons-material/HomeRepairServiceRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const Widget = ({ type }) => {
  const [userCount, setUserCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUserCount(response.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItemCount(response.data.length);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchLowStockItems = async () => {
      try {
        const response = await axios.get('/api/items/items/low-stock');
        setLowStockCount(response.data.length);
      } catch (error) {
        console.error("Error fetching low stock items:", error);
      }
    };

    const fetchOutOfStockItems = async () => {
      try {
        const response = await axios.get('/api/items/items/out-of-stock');
        setOutOfStockCount(response.data.length);
      } catch (error) {
        console.error("Error fetching out-of-stock items:", error);
      }
    };

    switch (type) {
      case "Total users":
        fetchUsers();
        break;

      case "Total items":
        fetchItems();
        break;

      case "Low stock":
        fetchLowStockItems();
        break;

      case "Out of stock":
        fetchOutOfStockItems();
        break;

      default:
        break;
    }
  }, [type]);

  let data;

  switch (type) {
    case "Total users":
      data = {
        title: "Total users",
        counter: userCount,
        link: "See all users",
        icon: <PersonRoundedIcon
          className="icon"
          style={{
            color: "white",
            backgroundColor: "gray"
          }}
        />,
      };
      break;

    case "Total items":
      data = {
        title: "Total items",
        counter: itemCount,
        link: "See all items",
        icon: <HomeRepairServiceRoundedIcon
          className="icon"
          style={{
            color: "white",
            backgroundColor: "#736f4e"
          }}
        />,
      };
      break;

    case "Low stock":
      data = {
        title: "Low stock",
        counter: lowStockCount,
        link: "See details",
        icon: <TrendingDownRoundedIcon
          className="icon"
          style={{
            color: "white",
            backgroundColor: "#e89005"
          }}
        />,
      };
      break;

    case "Out of stock":
      data = {
        title: "Out of stock",
        counter: outOfStockCount,
        link: "See details",
        icon: <WarningAmberRoundedIcon
          className="icon"
          style={{
            color: "white",
            backgroundColor: "#bf211e"
          }}
        />,
      };
      break;

    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.counter || "Loading..."}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          20%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;

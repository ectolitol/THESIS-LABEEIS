import React, { useState, useEffect } from "react";
import "./sidebar.scss";
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HomeRepairServiceRoundedIcon from '@mui/icons-material/HomeRepairServiceRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import MenuIcon from '@mui/icons-material/Menu'; // For the toggle icon
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("sidebarState") === "closed" ? false : true
  );

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    localStorage.setItem("sidebarState", newIsOpen ? "open" : "closed");
  };

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState === "closed") {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="top">
        <span className="logo" style={{ display: isOpen ? "block" : "none" }}>ADMIN</span>
        <div className="toggle-btn">
          <MenuIcon onClick={toggleSidebar} />
        </div>
      </div>
      <hr />

      <div className="center">
        <ul>
          <li>
            <Link to="/" className="menu-link">
              <DashboardCustomizeRoundedIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/users" className="menu-link">
              <PersonRoundedIcon className="icon" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link to="/items" className="menu-link">
              <HomeRepairServiceRoundedIcon className="icon" />
              <span>Items</span>
            </Link>
          </li>
          <li>
            <Link to="/categories" className="menu-link">
              <CategoryRoundedIcon className="icon" />
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="menu-link">
              <NotificationsActiveRoundedIcon className="icon" />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className="menu-link">
              <LeaderboardRoundedIcon className="icon" />
              <span>Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/feedback" className="menu-link">
              <RateReviewRoundedIcon className="icon" />
              <span>Feedback/Support</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className="menu-link">
              <InfoRoundedIcon className="icon" />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" className="menu-link">
              <ExitToAppRoundedIcon className="icon" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

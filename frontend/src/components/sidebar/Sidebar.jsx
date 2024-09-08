import React, { useState } from "react";
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open state

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

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
            <DashboardCustomizeRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Dashboard</span>
          </li>
          <li>
            <PersonRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Users</span>
          </li>
          <li>
            <HomeRepairServiceRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Items</span>
          </li>
          <li>
            <CategoryRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Categories</span>
          </li>
          <li>
            <NotificationsActiveRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Notifications</span>
          </li>
          <li>
            <LeaderboardRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Reports</span>
          </li>
          <li>
            <RateReviewRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Feedback/Support</span>
          </li>
          <li>
            <InfoRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>About</span>
          </li>
          <li>
            <ExitToAppRoundedIcon className="icon" />
            <span style={{ display: isOpen ? "inline" : "none" }}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

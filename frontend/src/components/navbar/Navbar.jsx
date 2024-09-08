import { useState } from 'react';
import './navbar.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="navbar">
      <div className="logo">LABEEIS</div>
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchRoundedIcon className="icon" />
        </div>

        <div className="items">
          <div className="item">
            <ContrastRoundedIcon className="icon" />
          </div>

          <div className="item" onClick={() => setShowNotifications(!showNotifications)}>
            <NotificationsActiveRoundedIcon className="icon" />
            <div className="counter">1</div>
            {showNotifications && (
              <div className="dropdown">
                <p>You have new notifications</p>
              </div>
            )}
          </div>

          <div className="item" onClick={() => setShowProfile(!showProfile)}>
            <AccountCircleRoundedIcon className="icon" />
            {showProfile && (
              <div className="dropdown">
                <p>Admin Profile</p>
                <p>Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

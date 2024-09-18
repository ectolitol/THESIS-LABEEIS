import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch unread notifications count and details
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications/notif/unread');
        setNotifications(response.data);
        setUnreadCount(response.data.length);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    fetchUnreadNotifications();
  }, [showNotifications]); // Fetch notifications when dropdown is opened

  const toggleNotificationsDropdown = () => {
    setShowNotifications(prev => !prev);
    if (showProfile) setShowProfile(false); // Close profile if open
  };

  const toggleProfileDropdown = () => {
    setShowProfile(prev => !prev);
    if (showNotifications) setShowNotifications(false); // Close notifications if open
  };

  // Handle clicks outside of profile and notifications dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (profileRef.current && !profileRef.current.contains(event.target)) &&
        (notificationsRef.current && !notificationsRef.current.contains(event.target))
      ) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic link generator based on notification type
  const generateNotificationLink = (notification) => {
    const type = notification.type.toLowerCase();
  
    if (type.includes('item')) {
      return `/items`; // Redirect to low stock items page
    } else if (type.includes('user')) {
      return `/users`; // Redirect to new users page
    } else if (type.includes('overdue')) {
      return `/borrow-return`; // Redirect to overdue transactions page
    }else if (type.includes('stock')) {
      return `/items`; // Redirect to new users page
    } else {
      return `/notifications/${notification._id}`; // Fallback link for generic notification page
    }
    
  };
  

  return (
    <div className="navbar">
      <div className="logo">LABEEIS</div>
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchRoundedIcon className="icon" />
        </div>

        <div className="items">
          <Tooltip title="Toggle Theme" disableInteractive>
            <div className="item">
              <ContrastRoundedIcon className="icon" />
            </div>
          </Tooltip>

          <Tooltip title="Notifications" disableInteractive>
            <div 
              className="item" 
              ref={notificationsRef} 
              onClick={toggleNotificationsDropdown}
            >
              <NotificationsActiveRoundedIcon className="icon" />
              {unreadCount > 0 && (
                <div className="counter">{unreadCount}</div>
              )}
              {showNotifications && (
                <div className="dropdown">
                  {notifications.length === 0 ? (
                    <p>No notifications</p>
                  ) : (
                    notifications.map(notification => (
                      <Link
                        to={generateNotificationLink(notification)}
                        key={notification._id}
                        className="notification-item"
                        onClick={() => {
                          // Mark notification as read
                          axios.patch(`/api/notifications/${notification._id}/read`);
                          setUnreadCount(prevCount => prevCount - 1);
                          setShowNotifications(false);
                        }}
                      >
                        <p>{notification.message}</p>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </Tooltip>

          <Tooltip title="Profile" disableInteractive>
            <div 
              className="item" 
              ref={profileRef} 
              onClick={toggleProfileDropdown}
            >
              <AccountCircleRoundedIcon className="icon" />
              {showProfile && (
                <div className="dropdown">
                  <Link 
                    to="/profile" 
                    className="dropdown-item" 
                    onClick={() => setShowProfile(false)}
                  >
                    Admin Profile
                  </Link>
                  <Link 
                    to="/logout" 
                    className="dropdown-item" 
                    onClick={() => setShowProfile(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

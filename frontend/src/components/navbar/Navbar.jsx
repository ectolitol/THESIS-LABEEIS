import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import ProfileDropdown from '../profileDropdown/ProfileDropdown';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [admin, setAdmin] = useState(null);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

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
  }, [showNotifications]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('/api/admin/profiles/me'); // Fetch only the logged-in admin
        setAdmin(response.data); // Set the admin state with the specific profile
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  const toggleNotificationsDropdown = () => {
    setShowNotifications(prev => !prev);
    if (showProfile) setShowProfile(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfile(!showProfile);
  };

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

  const generateNotificationLink = (notification) => {
    const type = notification.type.toLowerCase();
    if (type.includes('new item')) {
      return `/items`;
    } else if (type.includes('user')) {
      return `/users`;
    } else if (type.includes('overdue') || type.includes('extended')) {
      return `/`;
    } else if (type.includes('stock')) {
      return `/items`;
    } else {
      return `/notifications/${notification._id}`;
    }
  };

  const updateAdminProfile = (updatedProfile) => {
    setAdmin(updatedProfile);
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
            <div ref={profileRef} onClick={toggleProfileDropdown} className="item">
              {admin && <AccountCircleRoundedIcon className="icon" />}
              {showProfile && (
                <ProfileDropdown
                  admin={admin}
                  isOpen={showProfile}
                  toggleDropdown={toggleProfileDropdown}
                  updateAdminProfile={updateAdminProfile}
                />
              )}
            </div> 
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
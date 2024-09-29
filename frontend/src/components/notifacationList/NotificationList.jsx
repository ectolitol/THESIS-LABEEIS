import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './notificationList.scss';
import axios from 'axios';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'; // Import necessary functions
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';


const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Date');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
        setFilteredNotifications(response.data);
        const unreadResponse = await axios.get('/api/notifications/notif/unread');
        setUnreadCount(unreadResponse.data.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const applyFilterAndSort = () => {
      let updatedList = [...notifications];

      if (filter === 'Unread') {
        updatedList = updatedList.filter(notification => !notification.isRead);
      }

      if (searchTerm) {
        updatedList = updatedList.filter(notification =>
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (sort === 'Date') {
        updatedList.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sort === 'Type') {
        updatedList.sort((a, b) => a.type.localeCompare(b.type));
      }

      setFilteredNotifications(updatedList);
    };

    applyFilterAndSort();
  }, [notifications, filter, searchTerm, sort]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleSortChange = (sortType) => {
    setSort(sortType);
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);
      await Promise.all(unreadNotifications.map(notification =>
        axios.patch(`/api/notifications/${notification._id}/read`)
      ));
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Group notifications by date
  const groupByDate = (notifications) => {
    const grouped = {};
    notifications.forEach(notification => {
      const date = new Date(notification.date);
      const key = date.toDateString();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  // Function to display "Today", "Yesterday", or specific date in group header
  const getGroupDateLabel = (date) => {
    const notificationDate = new Date(date);
    if (isToday(notificationDate)) {
      return 'Today';
    } else if (isYesterday(notificationDate)) {
      return 'Yesterday';
    } else {
      return format(notificationDate, 'EEE MMM dd yyyy'); // For dates older than yesterday
    }
  };

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

  // Delete a notification
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== id)
      );
      setFilteredNotifications(prevFilteredNotifications =>
        prevFilteredNotifications.filter(notification => notification._id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <button onClick={() => handleFilterChange('Unread')}>Unread ({unreadCount})</button>
        <button onClick={() => handleFilterChange('All')}>All</button>
        <button onClick={markAllAsRead}>Mark all as read</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={(e) => handleSortChange(e.target.value)} value={sort}>
          <option value="Date">Sort by: Date</option>
          <option value="Type">Sort by: Type</option>
        </select>
      </div>
      <div className="notification-list__body">
        {Object.entries(groupedNotifications).map(([date, notifications]) => (
          <div key={date} className="notification-list__group">
            <div className="notification-list__date">
              {getGroupDateLabel(date)} {/* Display relative grouping date */}
            </div>
            {notifications.map(notification => (
              <div key={notification._id} className={`notification-list__item ${notification.isRead ? '' : 'unread'}`}>
                <Link
                  to={generateNotificationLink(notification)}
                  className="notification-list__message"
                  onClick={async () => {
                    if (!notification.isRead) {
                      try {
                        await axios.patch(`/api/notifications/${notification._id}/read`);
                        setUnreadCount(prevCount => prevCount - 1);
                        setNotifications(prevNotifications =>
                          prevNotifications.map(n =>
                            n._id === notification._id ? { ...n, isRead: true } : n
                          )
                        );
                      } catch (error) {
                        console.error('Error marking notification as read:', error);
                      }
                    }
                  }}
                >
                  {notification.message}
                  {!notification.isRead && <span className="notification-list__indicator">•</span>}
                </Link>
                <button 
                  onClick={() => handleDelete(notification._id)} 
                  className="notification-list__delete-button"
                >
                  <DeleteOutlineRoundedIcon fontSize="small" className='deleteButton'/>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;

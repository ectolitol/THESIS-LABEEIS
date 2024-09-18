import "./notification.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import NotificationList from "../../components/notifacationList/NotificationList";

const Notification = () => {
  return (
    <div className="notification">
      <Sidebar/>
      <div className="notificationContainer">
            <Navbar/>
            <div className="pageTitle"> 
                <PageTitle page="Notifications"/>
                <div className="notifList">
                  <div className="notifTitle">
                    Notifications
                  </div>
                  <NotificationList/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notification
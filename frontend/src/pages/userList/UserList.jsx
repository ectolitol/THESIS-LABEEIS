import "./userList.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import UserTable from '../../components/userTable/UserTable';
import {Link} from "react-router-dom"
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
 
const UserList = () => {
  return (
    <div className="userList">
      <Sidebar/>
      <div className="userListContainer">
        <Navbar/>
        <div className="Content">
        <CustomBreadcrumbs/>
            <div className="userListTable">
              <div className="userListTitle">
                <span className="title">List of Users</span>
                  <Link to="/users/newUser" className="link">
                    <button className="addUser">Add New User</button>
                  </Link>
              </div>
              <UserTable/>
          </div>
        </div>
      </div>
    </div>
  )
}



export default UserList
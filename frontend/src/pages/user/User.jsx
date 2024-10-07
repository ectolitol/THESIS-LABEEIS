import "./user.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import SingleUser from '../../components/singleUser/SingleUser';
import SingleTransaction from '../../components/singleTransaction/SingleTransaction';
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
 
const User = () => {
  return (
    <div className="user">
      <Sidebar/>
      <div className="userContainer">
        <Navbar/> 
        <div className="Content">
        <CustomBreadcrumbs/>
            <SingleUser/>
          <div className="bottom">
            <div className="userTitle">User Transactions</div>
            <SingleTransaction/>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default User 
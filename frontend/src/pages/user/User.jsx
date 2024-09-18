import "./user.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import SingleUser from '../../components/singleUser/SingleUser';
import SingleTransaction from '../../components/singleTransaction/SingleTransaction';
 
const User = () => {
  return (
    <div className="user">
      <Sidebar/>
      <div className="userContainer">
        <Navbar/>
        <div className="pageTitle"> 
            <PageTitle page="User"/>
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
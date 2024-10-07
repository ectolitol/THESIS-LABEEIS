import "./newUser.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import UserRegistration from '../../components/userRegistration/UserRegistration';
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const NewUser = () => {
  return (
    <div className="newUser">
      <Sidebar/>
      <div className="newUserContainer">
        <Navbar/>
        <div className="Content">
          <CustomBreadcrumbs/>
            <UserRegistration/>
        </div>
      </div>
    </div>
  )
}

export default NewUser
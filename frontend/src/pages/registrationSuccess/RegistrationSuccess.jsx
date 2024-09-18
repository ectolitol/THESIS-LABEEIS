import "./registrationSuccess.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import RegiSuccess from "../../components/regiSuccess/RegiSuccess";

const RegistrationSuccess = () => {
  return (
    <div className="success">
      <Sidebar/>
      <div className="successContainer">
        <Navbar/>
        <div className="pageTitle">
          <PageTitle page="New User"/>
            <RegiSuccess/>
        </div>
      </div>
    </div>
  )
}
 
export default RegistrationSuccess
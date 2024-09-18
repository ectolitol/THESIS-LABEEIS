import "./creationSuccess.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import CreateSuccess from "../../components/createSuccess/CreateSuccess";

const CreationSuccess = () => {
  return (
    <div className="success">
      <Sidebar/>
      <div className="successContainer">
        <Navbar/>
        <div className="pageTitle">
          <PageTitle page="New Item"/>
            <CreateSuccess/>
        </div>
      </div>
    </div>
  )
}
 
export default CreationSuccess
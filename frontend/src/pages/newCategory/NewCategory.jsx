import "./newCategory.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import CategoryRegistration from "../../components/categoryRegistration/CategoryRegistration";

const NewCategory = () => {
  return (
    <div className="newCategory">
      <Sidebar/>
        <div className="newCategoryContainer">
          <Navbar/>
            <div className="pageTitle"> 
                <PageTitle page="New Category"/>
                <CategoryRegistration/>
            </div>
        </div>
    </div>
  )
}

export default NewCategory
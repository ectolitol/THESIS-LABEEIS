import "./categoryList.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import CategoryTable from "../../components/categoryTable/CategoryTable";
import {Link} from "react-router-dom"
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const CategoryList = () => {
  return (
    <div className="categoryList">
      <Sidebar/>
      <div className="categoryListContainer">
        <Navbar/>
        <div className="Content">
            <CustomBreadcrumbs/>
             <div className="categoryListTable">
              <div className="categoryListTitle">
                <span className="title">List of Categories</span>
                <Link to="/categories/newCategory" className="link"> 
                  <button className="addCategory">Add New Category</button>
                </Link>
              </div>
                <CategoryTable/>
             </div>
          </div>
      </div>
    </div>
  )
}

export default CategoryList
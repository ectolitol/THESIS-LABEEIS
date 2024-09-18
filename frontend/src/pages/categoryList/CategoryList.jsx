import "./categoryList.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import CategoryTable from "../../components/categoryTable/CategoryTable";
import {Link} from "react-router-dom"

const CategoryList = () => {
  return (
    <div className="categoryList">
      <Sidebar/>
      <div className="categoryListContainer">
        <Navbar/>
          <div className="pageTitle">
            <PageTitle page="Categories"/>
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
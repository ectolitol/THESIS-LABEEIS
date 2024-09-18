import "./category.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import CategoryItems from "../../components/categoryItems/CategoryItems";

const Category = () => {
  return (
    <div className="category">
      <Sidebar/>
        <div className="categoryContainer">
          <Navbar/> 
            <div className="pageTitle"> 
                <PageTitle page="Category"/>
                <div className="categoryItemContainer">
                  <div className="itemTitle">Item Transaction History</div>
                    <CategoryItems/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Category
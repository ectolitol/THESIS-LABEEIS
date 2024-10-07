import "./itemList.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import { ItemTable } from "../../components/itemTable/ItemTable";
import {Link} from "react-router-dom"
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const ItemList = () => {
  return (
    <div className="itemList">
        <Sidebar/>
        <div className="itemListContainer">
            <Navbar/>
            <div className="Content">
                <CustomBreadcrumbs/>
                <div className="itemListTable">
                    <div className="itemListTitle">
                        <span className="title">List of Items</span>
                        <Link to="/items/newItem" className="link"> 
                            <button className="addItem">Add New Item</button>
                        </Link>
                    </div>
                    <ErrorBoundary>
                        <ItemTable />
                    </ErrorBoundary>
                </div>   
            </div>
        </div>
    </div>
  )
}

export default ItemList
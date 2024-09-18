import "./itemList.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import { ItemTable } from "../../components/itemTable/ItemTable";
import {Link} from "react-router-dom"

const ItemList = () => {
  return (
    <div className="itemList">
        <Sidebar/>
        <div className="itemListContainer">
            <Navbar/>
            <div className="pageTitle">
                <PageTitle page="Items"/>
                <div className="itemListTable">
                    <div className="itemListTitle">
                        <span className="title">List of Items</span>
                        <Link to="/items/newItem" className="link"> 
                            <button className="addItem">Add New Item</button>
                        </Link>
                    </div>
                    <ItemTable/>
                </div>   
            </div>
        </div>
    </div>
  )
}

export default ItemList
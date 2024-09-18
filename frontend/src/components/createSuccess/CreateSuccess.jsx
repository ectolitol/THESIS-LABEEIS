import "./createSuccess.scss"
import {Link} from "react-router-dom"

const CreateSuccess = () => {
  return (
    <div className="successMessage">
            Item Added Successfully!

            <div className="successTitle">
              <Link to="/items/newItem" className="link"> 
                  <button className="addItem">Add New Item</button>
              </Link>   
          </div>

          <div className="itemList">
              <Link to="/items" className="link"> 
                  <button className="addItem">Back to Items</button>
              </Link>
          </div>
    </div>
  )
}

export default CreateSuccess 
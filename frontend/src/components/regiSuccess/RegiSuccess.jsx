import "./regiSuccess.scss"
import {Link} from "react-router-dom"

const RegiSuccess = () => {
  return (
    <div className="successMessage">
            Registration successful! Await admin approval.
            <div className="successTitle">
              <Link to="/users" className="link"> 
                  <button className="addItem">Back to Users</button>
              </Link>   
          </div>
    </div>
  )
}

export default RegiSuccess 
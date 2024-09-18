import "./feedback.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import FeedbackForm from "../../components/feedbackForm/FeedbackForm";

const Feedback = () => {
  return (
    <div className="feedback">
      <Sidebar/>
        <div className="feedbackContainer">
          <Navbar/>
            <div className="pageTitle"> 
                <PageTitle page="Feedback"/>
                <FeedbackForm/>
                
            </div>
        </div>
    </div>
  )
}

export default Feedback
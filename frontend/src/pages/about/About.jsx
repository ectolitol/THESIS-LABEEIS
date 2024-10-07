import "./about.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import React from 'react'
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const About = () => {
    return (
        <div className="about">
        <Sidebar/>
        <div className="aboutContainer">
            <Navbar/> 
            <div className="Content">
                <CustomBreadcrumbs/>
            </div>
        </div>
    </div>
    )
}

export default About
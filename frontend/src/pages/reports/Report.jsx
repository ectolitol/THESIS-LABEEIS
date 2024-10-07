import "./reports.scss"
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import React from 'react'
import CustomBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import LogChart from "../../components/logChart/LogChart";

const Report = () => {
    return (
        <div className="report">
        <Sidebar/>
        <div className="reportContainer">
            <Navbar/> 
            <div className="Content">
                <CustomBreadcrumbs/>
                <LogChart/>
            </div>
        </div>
    </div>
    )
}

export default Report
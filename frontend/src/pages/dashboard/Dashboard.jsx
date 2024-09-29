import { useState } from 'react';
import "./dashboard.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import Widget from "../../components/widget/Widget";
import BorrowReturnTable from "../../components/borrowReturnTable/BorrowReturnTable";
import LogChart from "../../components/logChart/LogChart";
import StockChart from "../../components/stockChart/StockChart";



const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar/>
      <div className="dashboardContainer">
        <Navbar/>
          <div className="pageTitle"> 
            <PageTitle page="Dashboard"/>
        <div className="widgets">
          <Widget type="Total users" />
          <Widget type="Total items" />
          <Widget type="Low stock" />
          <Widget type="Out of stock" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Borrow/Return Transactions</div>
          <BorrowReturnTable/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState } from 'react';
import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import PageTitle from '../../components/pageTitle/PageTitle';
import Widget from "../../components/widget/Widget";
import BorrowReturnTable from "../../components/borrowReturnTable/BorrowReturnTable";
import LogChart from "../../components/logChart/LogChart";
import StockChart from "../../components/stockChart/StockChart";


const Home = () => {
  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
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

export default Home;


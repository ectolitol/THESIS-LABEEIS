import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import UserList from './pages/userList/UserList';
import User from './pages/user/User';
import NewUser from './pages/newUser/NewUser';
import ItemList from './pages/itemList/ItemList';
import Item from './pages/item/Item';
import NewItem from './pages/newItem/NewItem';
import CategoryList from './pages/categoryList/CategoryList';
import Category from './pages/category/Category';
import NewCategory from './pages/newCategory/NewCategory';
import Notification from './pages/notification/Notification';
import Feedback from './pages/feedback/Feedback';
import SelectAdmin from './pages/selectAdmin/SelectAdmin';
import './config/axiosConfig';
import UserSelection from './pages/userPanel/userSelection/UserSelection';
import NewUserInstruction from './pages/userPanel/newUserInstruction/newUserInstruction';
import BorrowReturnSelection from './pages/userPanel/borrowReturnSelection/BorrowReturnSelection';
import QRIDScan from './pages/userPanel/QRIDScan/QRIDScan';
import BorrowingProcess from './pages/userPanel/borrowingProcess/BorrowingProcess';
import ItemScan from './components/itemScan/ItemScan';
import BorrowSuccess from './components/borrowSuccess/BorrowSuccess';
import ReturningProcess from './pages/userPanel/returningProcess/returningProcess';
import ItemReturnScan from './components/itemReturnScan/ItemReturnScan';
import ReturnSuccess from './components/returnSuccess/ReturnSuccess';
import ReturnPartial from './components/returnPartial/ReturnPartial';
import ReportForm from './components/reportForm/ReportForm';
import NewUserRegistrationForm from './pages/userPanel/newUserRegistrationForm/NewUserRegistrationForm';
import Report from './pages/reports/Report';
import Archives from './pages/archives/Archives';
import About from './pages/about/About';
import Stocks from './pages/stocks/Stocks';
import UserWelcome from './pages/UserWelcome/UserWelcome';
import AdminWelcome from './pages/adminWelcome/AdminWelcome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<UserWelcome />} />
            <Route path="/lab/admin" element={<AdminWelcome />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-profile" element={<SelectAdmin />} />

            {/* User Routes */}
            <Route path="/user-selection" element={<UserSelection />} />
            <Route path="/registration" element={<NewUserInstruction />} />
            <Route path="/new-user-registration" element={<NewUserRegistrationForm />} />
            <Route path="/scan-qr-id" element={<QRIDScan />} />
            <Route path="/borrow-return-selection" element={<BorrowReturnSelection />} />

            <Route path="/borrowing" element={<BorrowingProcess />} />
            <Route path="/item-scan" element={<ItemScan />} />
            <Route path="/borrow-success" element={<BorrowSuccess />} />

            <Route path="/returning" element={<ReturningProcess />} />
            <Route path="/item-return-scan/:transactionId" element={<ItemReturnScan />} />
            <Route path="/return-success" element={<ReturnSuccess />} />
            <Route path="/return-partial" element={<ReturnPartial />} />

            {/* Protected Admin Routes */}
            <Route
              path="/EELMS"
              element={
                
                  <Dashboard />
                
              }
            />
            <Route
              path="/users"
              element={
                
                  <UserList />
                
              }
            />
            <Route
              path="/users/:userId"
              element={
                
                  <User />
                
              }
            />
            <Route
              path="/users/newUser"
              element={
                
                  <NewUser />
                
              }
            />

            <Route
              path="/items"
              element={
                
                  <ItemList />
                
              }
            />
            <Route
              path="/items/:itemId"
              element={
                
                  <Item />
                
              }
            />
            <Route
              path="/items/newItem"
              element={
                
                  <NewItem />
                
              }
            />

            <Route
              path="/items/stocks"
              element={
                
                  <Stocks />
                
              }
            />

            <Route
              path="/categories"
              element={
                
                  <CategoryList />
                
              }
            />
            <Route
              path="/categories/:categoryId"
              element={
                
                  <Category />
                
              }
            />
            <Route
              path="/categories/newCategory"
              element={
                
                  <NewCategory />
                
              }
            />

            <Route
              path="/notifications"
              element={
                
                  <Notification />
                
              }
            />
            <Route
              path="/reports"
              element={
                
                  <Report />
                
              }
            />
            <Route
              path="/archives"
              element={
                
                  <Archives />
                
              }
            />
            <Route
              path="/feedback"
              element={
                
                  <Feedback />
                
              }
            />
            <Route
              path="/about"
              element={
                
                  <About />
                
              }
            />
          </Routes>
      </BrowserRouter>
    </div> 
  );
}

export default App;

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ItemList from "./pages/itemList/ItemList";
import Item from "./pages/item/Item";
import NewItem from "./pages/newItem/NewItem";
import RegistrationSuccess from "./pages/registrationSuccess/RegistrationSuccess";
import CategoryList from "./pages/categoryList/CategoryList";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreationSuccess from "./pages/creationSuccess/CreationSuccess";
import Category from "./pages/category/Category";
import NewCategory from "./pages/newCategory/NewCategory";
import Notification from "./pages/notification/Notification";
import Feedback from "./pages/feedback/Feedback";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login/>}/>

          <Route path="users">
            <Route index element={<UserList/>}/>
            <Route path=":userId" element={<User/>}/>
            <Route path="newUser" element={<NewUser/>}/>
            <Route path="registrationSuccessful" element={<RegistrationSuccess/>} />
          </Route>

          <Route path="items">
            <Route index element={<ItemList/>}/>
            <Route path=":itemId" element={<Item/>}/>
            <Route path="newItem" element={<NewItem/>}/>
            <Route path="CreationSuccessful" element={<CreationSuccess/>} />
          </Route>

          <Route path="categories">
            <Route index element={<CategoryList/>}/>
            <Route path=":categoryId" element={<Category/>}/>
            <Route path="newCategory" element={<NewCategory/>}/>
          </Route>

          <Route path="notifications">
            <Route index element={<Notification/>}/>
          </Route>

          <Route path="feedback">
            <Route index element={<Feedback/>}/>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import RegistrationSuccess from "./pages/registrationSuccess/RegistrationSuccess";
import { BrowserRouter, Routes, Route } from "react-router-dom"

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

          {/* <Route path="items">
            <Route index element={<List/>}/>
            <Route path=":itemId" element={<Single/>}/>
            <Route path="new" element={<New/>}/>
          </Route> */}

        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App

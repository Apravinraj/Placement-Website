import  Login from "./components/PO/LoginComponent/Login"
import Dashboard from "./components/Students/DashBoardComponents/Dashboard"
import PostJD from "./components/PO/PostJDComponent/PostJD"
import {BrowserRouter,Routes,Route, Link, Links, HashRouter,Navigate} from "react-router-dom"
import AdminLogin from "./components/PO/LoginComponent/AdminLogin"
import JobDescription from "./components/Students/DashBoardComponents/JobDescription"
import "bootstrap-icons/font/bootstrap-icons.css";
import Notifications from "./components/Students/Notification"
import Profile from "./components/Students/Profile"
import SignUp from "./components/PO/LoginComponent/SignUp"
import CreateLogin from "./components/PO/LoginComponent/CreateLogin"
import PrivateRoute from "./components/PrivateRoute"
function App() {
  

  return (
    <>
      <BrowserRouter basename="/Placement-Website/"> 
      {/* basename="/Placement-Website" */}
      {/* <NavBar1 onSearch={handleSearch} /> */}
  <Routes>
    <Route index element={<AdminLogin />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/postJD" element={<PostJD />} />
    <Route path="/adminLogin" element={<AdminLogin />} />
    <Route path="/job-description" element={<JobDescription />} />
    <Route path="/notification" element={<Notifications />} />
    <Route 
  path="/profile" 
  element={
    <PrivateRoute >
      <Profile />
    </PrivateRoute>
  } 
/>

<Route 
  path="/profile/:registerNumber" 
  element={<Profile />} 
/>

    <Route path="/signup" element={<SignUp/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/create-login" element={<CreateLogin/>} />

  </Routes>
</BrowserRouter>
    </>
  )
}

export default App

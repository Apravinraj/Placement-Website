import  Login from "./components/PO/LoginComponent/Login"
import Dashboard from "./components/Students/DashBoardComponents/Dashboard"
import PostJD from "./components/PO/PostJDComponent/PostJD"
import Detail from "./components/Students/Detail"
import {BrowserRouter,Routes,Route, Link, Links} from "react-router-dom"
import AdminLogin from "./components/PO/LoginComponent/AdminLogin"
import JobDescription from "./components/Students/DashBoardComponents/JobDescription"

function App() {
  

  return (
    <>
      <BrowserRouter>
      
      
          <Routes>
              <Route path = "/login" element={<Login/>}/>
              <Route path = "/postJD" element={<PostJD/>}/>
              <Route path = "/dashboard" element={<Dashboard/>}/>
              <Route path = "/details" element={<Detail/>}/>
              <Route path = "/adminLogin" element={<AdminLogin/>}/>
              <Route path = "/job-description" element={<JobDescription/>}/>

          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

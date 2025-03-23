import  Login from "./components/PO/LoginComponent/Login"
import Dashboard from "./components/Students/DashBoardComponents/Dashboard"
import PostJD from "./components/PO/PostJDComponent/PostJD"
import {BrowserRouter,Routes,Route, Link, Links} from "react-router-dom"
import AdminLogin from "./components/PO/LoginComponent/AdminLogin"
import JobDescription from "./components/Students/DashBoardComponents/JobDescription"

function App() {
  

  return (
    <>
      <BrowserRouter>
      
      
          <Routes>
              <Route path = "/" element={<Dashboard/>}/>
              <Route path = "/Placement-Website/Login" element={<Login/>}/>
              <Route path = "/Placement-Website/postJD" element={<PostJD/>}/>
              {/* <Route path = "/Placement-Website/dashboard" element={<Dashboard/>}/> */}
              <Route path = "/Placement-Website/adminLogin" element={<AdminLogin/>}/>
              <Route path = "/Placement-Website/job-description" element={<JobDescription/>}/>

          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

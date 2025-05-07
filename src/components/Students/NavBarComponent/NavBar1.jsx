import { useEffect, useState } from "react";
import { Navbar, Nav, Form, Container, Dropdown } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar1 = ({ onSearch }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const regNumber = localStorage.getItem("registerNumber") || "";
    setIsAdmin(adminStatus);
    setRegisterNumber(regNumber);
  }, [location]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleProfileClick = () => {
    if (registerNumber) {
      navigate(`/profile/${registerNumber}`);
    } else {
      navigate("/profile");
    }
    setExpanded(false);
  };

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      className="custom-navbar"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid>
        <Navbar.Brand 
          as={NavLink} 
          to="/dashboard" 
          className="nav-brand"
          onClick={handleNavLinkClick}
        >
          Campus Connect
        </Navbar.Brand>
        
        {/* Mobile Profile and Toggle Group */}
        <div className="d-flex d-lg-none align-items-center">
          <Dropdown align="end" className="me-2">
            <Dropdown.Toggle 
              variant="light" 
              id="dropdown-profile-mobile"  
              className="profile-toggle-mobile"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                width="30"
                height="30"
                className="rounded-circle"
              />
            </Dropdown.Toggle>
            
            <Dropdown.Menu className="dropdown-menu-mobile">
              <Dropdown.Item onClick={handleProfileClick}>
                Profile
              </Dropdown.Item>
              {!isAdmin && (
                <Dropdown.Item as={NavLink} to="/adminLogin" onClick={handleNavLinkClick}>
                  Admin Login
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Navbar.Toggle aria-controls="navbarScroll" className="ms-2" />
          </div>
        
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <NavLink 
              to="/notification" 
              className={`nav-link ${location.pathname === "/notification" ? "active-link" : ""}`}
              onClick={handleNavLinkClick}
            >
              Notice
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={`nav-link ${location.pathname === "/dashboard" ? "active-link" : ""}`}
              onClick={handleNavLinkClick}
            >
              Jobs
            </NavLink>
            
            {isAdmin && (
              <NavLink 
                to="/postJD" 
                className={`nav-link ${location.pathname === "/postJD" ? "active-link" : ""}`}
                onClick={handleNavLinkClick}
              >
                Add New Post
              </NavLink>
            )}
          </Nav>
          
          <Form className="d-flex my-2 my-lg-0">
            <Form.Control
              type="search"
              placeholder="Search Company"
              className="me-2 search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Form>
          
          <div className="d-none d-lg-flex align-items-center ms-3">
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="light" 
                id="dropdown-profile"  
                className="profile-toggle"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Profile"
                  width="35"
                  height="35"
                  className="rounded-circle"
                />
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfileClick}>
                  Profile
                </Dropdown.Item>
                {!isAdmin && (
                  <Dropdown.Item as={NavLink} to="/adminLogin" onClick={handleNavLinkClick}>
                    Admin Login
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar1;
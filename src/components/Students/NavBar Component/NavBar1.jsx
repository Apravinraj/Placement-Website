import { useEffect, useState } from "react";
import { Navbar, Nav, Form, FormControl, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./NavBar.css"; // Import CSS file for animations

const NavBar1 = ({ onSearch }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="/" className="nav-brand">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/" className={location.pathname === "/Placement-Website/dashboard" ? "active-link" : ""}>
              Home
            </Nav.Link>
            <Nav.Link href="/Placement-Website/adminLogin" className={location.pathname === "/Placement-Website/adminLogin" ? "active-link" : ""}>
              PO Login
            </Nav.Link>
            {isAdmin ? (
              <Nav.Link href="/Placement-Website/postJD" className={location.pathname === "/Placement-Website/postJD" ? "active-link" : ""}>
                Add New Post
              </Nav.Link>
            ) : (
              <Nav.Link disabled style={{ color: "#ccc" }}>Add New Post (Admin Only)</Nav.Link>
            )}
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search Company"
              className="me-2 search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar1;

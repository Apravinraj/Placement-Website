import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar1 from "../NavBar Component/NavBar1";
import { Card, Button, Row, Col } from "react-bootstrap";

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setFilteredData(parsedData);
    }
  }, []);

  const handleApply = (job) => {
    navigate("/job-description", { state: { job } });
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) =>
      item.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <NavBar1 onSearch={handleSearch} />
      <h2 className="my-4 mx-3" style={{color:"white"}}>Offers</h2>
      {filteredData.length > 0 ? (
        <Row className="mx-3">
          {filteredData.map((item, index) => (
            <Col md={4} key={index} className="mb-4" >
              <Card className="shadow-sm" style={{backgroundColor:"",color:""}}>
                <Card.Body>
                  <Card.Title>{item.companyName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{item.domain}</Card.Subtitle>
                  <Card.Text>
                    <strong>Category:</strong> {item.companyCategory} <br />
                    <strong>Package:</strong> {item.package} <br />
                    <strong>Last Date:</strong> {item.lastDate}
                  </Card.Text>
                  <Button variant="" style={{background:"#FFA500",color:"white"}} onClick={() => handleApply(item)}>Apply</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-3">No jobs found</p>
      )}
    </>
  );
}

export default Home;

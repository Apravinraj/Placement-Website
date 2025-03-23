import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import NavBar1 from "../../Students/NavBar Component/NavBar1";

function PostJD() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyCategory: "",
    appliedDate: "",
    lastDate: "",
    domain: "",
    jobDescription: "",
    package: "",
    type: "",
  });

  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    try {
      if (storedData && storedData !== "undefined") {
        setSubmittedData(JSON.parse(storedData));
      } else {
        setSubmittedData([]);
      }
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      setSubmittedData([]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.companyName) {
      const updatedData = [...submittedData, formData];

      setSubmittedData(updatedData);
      localStorage.setItem("formData", JSON.stringify(updatedData));

      setFormData({
        companyName: "",
        companyCategory: "",
        appliedDate: "",
        lastDate: "",
        domain: "",
        jobDescription: "",
        package: "",
        type: "",
      });
    }
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    handleDelete(index);
  };

  return (
    <div>
      <NavBar1 />
      <Card className="p-4 shadow-sm rounded-3 m-3">
        <h1 className="mb-4 text-center">New job Description</h1>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCategory">
              <Form.Label>Company Category</Form.Label>
              <Form.Select
                name="companyCategory"
                value={formData.companyCategory}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option value="Product Based">Product Based</option>
                <option value="Service Based">Service Based</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridAppliedDate">
              <Form.Label>Applied Date</Form.Label>
              <Form.Control
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastDate">
              <Form.Label>Last Date to Apply</Form.Label>
              <Form.Control
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDomain">
              <Form.Label>Domain</Form.Label>
              <Form.Select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AIML">AIML</option>
                <option value="Cyber Security">Cyber Security</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridJD">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                type="text"
                name="jobDescription"
                placeholder="Enter Job Description"
                value={formData.jobDescription}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPackage">
              <Form.Label>Package</Form.Label>
              <Form.Control
                type="text"
                name="package"
                placeholder="Enter Package"
                value={formData.package}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="formGridType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option value="Inplant Training">Inplant Training</option>
                <option value="Internship">Internship</option>
                <option value="Placement">Placement</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="justify-content-center">
            <Col xs="auto">
              <Button variant="" style={{background:"#FFA500",color:"white"}} type="submit" className="px-4 py-2">
                ADD POST
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Container className="mt-5">
        <h1 className="mb-4 text-light">Already Posted</h1>

        <Row>
          {submittedData.map((data, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="job-card">
                <Card.Body>
                  <Card.Title>{data.companyName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.domain}</Card.Subtitle>
                  <Card.Text>
                    <strong>Category:</strong> {data.companyCategory} <br />
                    <strong>Package:</strong> {data.package} <br />
                    <strong>Last Date:</strong> {data.lastDate}
                  </Card.Text>
                  <Button variant="warning" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default PostJD;

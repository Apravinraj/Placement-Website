import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import NavBar1 from "../NavBar Component/NavBar1";
import "./Dashboard.css";

function JobDescription() {
  const location = useLocation();
  const job = location.state?.job;

  if (!job) {
    return <p className="text-center mt-3">No job details available</p>;
  }

  return (
    <>
      <NavBar1 />
      <div className="container mt-4">
        <Card className="shadow-lg p-4">
          <Card.Body>
            <Card.Title className="mb-3">{job.companyName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{job.domain}</Card.Subtitle>
            <Card.Text >
              <strong >Category:</strong> {job.companyCategory} <br />
              <strong >Applied Date:</strong> {job.appliedDate} <br />
              <strong >Last Date:</strong> {job.lastDate} <br />
              <strong >Package:</strong> {job.package} <br />
              <strong >Type:</strong> {job.type} <br />
              <strong >Job Description:</strong> {job.jobDescription}
            </Card.Text>
            <Button variant="" style={{background:"#FFA500",color:"white"}}>Apply Now</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default JobDescription;

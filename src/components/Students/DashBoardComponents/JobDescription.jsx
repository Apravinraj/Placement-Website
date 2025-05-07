import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import NavBar1 from "../NavBarComponent/NavBar1";
import { db } from "../../../firebase"; // Adjust path as needed
import { doc, getDoc } from "firebase/firestore";

function JobDescription() {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [error, setError] = useState(null);

  // If job wasn't passed via state, try to get it from URL params
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const jobId = searchParams.get("id");
        
        if (jobId) {
          const jobDoc = await getDoc(doc(db, "jobs", jobId));
          if (jobDoc.exists()) {
            setJob({ id: jobDoc.id, ...jobDoc.data() });
          } else {
            setError("Job not found");
          }
        } else if (!job) {
          setError("No job details available");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (!job) {
      fetchJob();
    }
  }, [location.search, job]);

  const handleApply = () => {
    if (job) {
      navigate("/apply", { state: { job } });
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || "No job details available"}</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <NavBar1 />
      <div className="container mt-4 mb-5">
        <Card className="shadow-lg">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">{job.companyName}</h2>
            <small className="text-light">{job.domain}</small>
          </Card.Header>
          <Card.Body>
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong><i className="bi bi-building me-2"></i>Company Type:</strong> {job.companyCategory}</p>
                <p><strong><i className="bi bi-geo-alt-fill me-2"></i>Location:</strong> {job.companyLocation}</p>
                <p><strong><i className="bi bi-calendar-date me-2"></i>Apply by:</strong> {job.lastDate}</p>
              </div>
              <div className="col-md-6">
                <p><strong><i className="bi bi-currency-rupee me-2"></i>Package:</strong> {job.package}</p>
                <p><strong><i className="bi bi-briefcase me-2"></i>Job Type:</strong> {job.type}</p>
                <p><strong><i className="bi bi-person-badge me-2"></i>Role:</strong> {job.role}</p>
              </div>
            </div>

            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0"><i className="bi bi-card-text me-2"></i>Job Description</h5>
              </Card.Header>
              <Card.Body>
                <p>{job.jobDescription}</p>
                {job.jobExplanation && (
                  <>
                    <h6>Additional Details:</h6>
                    <p>{job.jobExplanation}</p>
                  </>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0"><i className="bi bi-list-check me-2"></i>Requirements</h5>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong><i className="bi bi-gender-ambiguous me-2"></i>Gender:</strong> {job.gender || "Both Male & Female"}
                  </li>
                  <li className="mb-2">
                    <strong><i className="bi bi-award me-2"></i>Current CGPA:</strong> {job.cgpa || "Min 7.0"}
                  </li>
                  <li className="mb-2">
                    <strong><i className="bi bi-calendar3 me-2"></i>Passed Out Year:</strong> {job.passedOutYear || "2024 or 2025"}
                  </li>
                  <li>
                    <strong><i className="bi bi-book me-2"></i>Accepted Courses:</strong> {job.acceptedCourse || "CSE, IT, AIML, ECE"}
                  </li>
                </ul>
              </Card.Body>
            </Card>

            {job.interviewRounds?.length > 0 && (
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-0"><i className="bi bi-diagram-3 me-2"></i>Hiring Process</h5>
                </Card.Header>
                <Card.Body>
                  <ol className="list-group list-group-numbered">
                    {job.interviewRounds.map((round, index) => (
                      <li key={index} className="list-group-item border-0">
                        <strong>{round.roundType}:</strong> {round.description}
                      </li>
                    ))}
                  </ol>
                </Card.Body>
              </Card>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left me-2"></i>Back
              </Button>
              <Button 
                variant="" 
                style={{ background: "#FFA500", color: "white" }}
                onClick={handleApply}
              >
                <i className="bi bi-send-check me-2"></i>Apply Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default JobDescription;
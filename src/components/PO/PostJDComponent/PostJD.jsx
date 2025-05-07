import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import NavBar1 from "../../Students/NavBarComponent/NavBar1";
import { db } from "../../../firebase"; // Adjust path as needed
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

function PostJD() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyCategory: "",
    role: "",
    companyLocation: "",
    lastDate: "",
    domain: "",
    jobDescription: "",
    package: "",
    type: "",
    interviewRounds: [],
    gender: "",
    cgpa: "",
    passedOutYear: "",
    acceptedCourse: "",
    jobExplanation: "",
    isOpened: false,
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [numRounds, setNumRounds] = useState(0);
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Reference to the jobs collection in Firestore
  const jobsCollectionRef = collection(db, "jobs");

  // Fetch data from Firestore on component mount
  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      try {
        const data = await getDocs(jobsCollectionRef);
        const jobsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubmittedData(jobsData);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoundCountChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setNumRounds(value);
    const roundsArray = Array.from({ length: value }, () => ({
      roundType: "",
      description: "",
    }));
    setInterviewRounds(roundsArray);
  };

  const handleRoundDetailChange = (index, field, value) => {
    const updatedRounds = [...interviewRounds];
    updatedRounds[index][field] = value;
    setInterviewRounds(updatedRounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName) return;

    const completeData = {
      ...formData,
      interviewRounds,
      isOpened: false,
      createdAt: new Date().toISOString() // Add timestamp
    };

    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing document
        const jobDoc = doc(db, "jobs", editingId);
        await updateDoc(jobDoc, completeData);
        setSubmittedData(submittedData.map(item => 
          item.id === editingId ? { ...completeData, id: editingId } : item
        ));
        setEditingId(null);
      } else {
        // Add new document
        const docRef = await addDoc(jobsCollectionRef, completeData);
        setSubmittedData([...submittedData, { ...completeData, id: docRef.id }]);
      }

      // Reset form
      setFormData({
        companyName: "",
        companyCategory: "",
        role: "",
        companyLocation: "",
        lastDate: "",
        domain: "",
        jobDescription: "",
        package: "",
        type: "",
        interviewRounds: [],
        gender: "",
        cgpa: "",
        passedOutYear: "",
        acceptedCourse: "",
        jobExplanation: "",
        isOpened: false,
      });
      setNumRounds(0);
      setInterviewRounds([]);
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const jobDoc = doc(db, "jobs", id);
      await deleteDoc(jobDoc);
      setSubmittedData(submittedData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setFormData({
      companyName: job.companyName,
      companyCategory: job.companyCategory,
      role: job.role,
      companyLocation: job.companyLocation,
      lastDate: job.lastDate,
      domain: job.domain,
      jobDescription: job.jobDescription,
      package: job.package,
      type: job.type,
      interviewRounds: job.interviewRounds || [],
      gender: job.gender,
      cgpa: job.cgpa,
      passedOutYear: job.passedOutYear,
      acceptedCourse: job.acceptedCourse,
      jobExplanation: job.jobExplanation || "",
      isOpened: job.isOpened || false,
    });
    setInterviewRounds(job.interviewRounds || []);
    setNumRounds(job.interviewRounds?.length || 0);
    setEditingId(job.id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar1 />
      <Card className="p-4 shadow-sm rounded-3 m-3">
        <h1 className="mb-4 text-center">{editingId ? "Edit Job Description" : "New Job Description"}</h1>
        <Form onSubmit={handleSubmit}>
  {/* Company Information */}
  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Company Name</Form.Label>
      <Form.Control
        name="companyName"
        placeholder="Enter company name"
        value={formData.companyName}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Company Category</Form.Label>
      <Form.Select
        name="companyCategory"
        value={formData.companyCategory}
        onChange={handleChange}
        required
      >
        <option value="">Choose...</option>
        <option value="Product Based">Product Based</option>
        <option value="Service Based">Service Based</option>
      </Form.Select>
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Role</Form.Label>
      <Form.Control
        name="role"
        placeholder="Enter job role"
        value={formData.role}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Company Location</Form.Label>
      <Form.Select
        name="companyLocation"
        value={formData.companyLocation}
        onChange={handleChange}
        required
      >
        <option value="">Choose...</option>
        <option value="Chennai">Chennai</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Pune">Pune</option>
      </Form.Select>
    </Form.Group>
  </Row>

  {/* Job Details */}
  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Last Date to Apply</Form.Label>
      <Form.Control
        type="date"
        name="lastDate"
        value={formData.lastDate}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Domain</Form.Label>
      <Form.Select
        name="domain"
        value={formData.domain}
        onChange={handleChange}
        required
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
    <Form.Group as={Col}>
      <Form.Label>Job Description</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        name="jobDescription"
        placeholder="Enter job description"
        value={formData.jobDescription}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Package (LPA)</Form.Label>
      <Form.Control
        type="text"
        name="package"
        placeholder="Enter salary package"
        value={formData.package}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Job Type</Form.Label>
      <Form.Select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="">Choose...</option>
        <option value="Inplant Training">Inplant Training</option>
        <option value="Internship">Internship</option>
        <option value="Placement">Placement</option>
      </Form.Select>
    </Form.Group>
  </Row>

  {/* Eligibility Criteria */}
  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Gender Requirement</Form.Label>
      <Form.Select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">Choose...</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Both">Both</option>
      </Form.Select>
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Minimum CGPA Required</Form.Label>
      <Form.Control
        type="number"
        step="0.01"
        min="0"
        max="10"
        name="cgpa"
        placeholder="Enter minimum CGPA"
        value={formData.cgpa}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Passed Out Year</Form.Label>
      <Form.Control
        type="number"
        name="passedOutYear"
        placeholder="Enter eligible passing year"
        value={formData.passedOutYear}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>Accepted Courses</Form.Label>
      <Form.Control
        name="acceptedCourse"
        placeholder="Ex: B.E CSE, B.Tech IT"
        value={formData.acceptedCourse}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </Row>

  

  {/* Interview Rounds */}
  <Row className="mb-4">
    <Form.Group as={Col}>
      <Form.Label>Number of Interview Rounds</Form.Label>
      <Form.Control
        type="number"
        min="0"
        value={numRounds}
        onChange={handleRoundCountChange}
      />
    </Form.Group>
  </Row>

  {interviewRounds.map((round, index) => (
    <Row key={index} className="mb-4">
      <Form.Group as={Col} md={6}>
        <Form.Label>Round {index + 1} Description</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Description for Round ${index + 1}`}
          value={round.description}
          onChange={(e) =>
            handleRoundDetailChange(index, "description", e.target.value)
          }
        />
      </Form.Group>
      <Form.Group as={Col} md={6}>
        <Form.Label>Round Type</Form.Label>
        <Form.Select
          value={round.roundType}
          onChange={(e) =>
            handleRoundDetailChange(index, "roundType", e.target.value)
          }
        >
          <option value="">Select Type</option>
          <option value="Application_Screening">Application Screening</option>
          <option value="Test">Test</option>
          <option value="Technical">Technical</option>
          <option value="HR">HR</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Managerial">Managerial</option>
        </Form.Select>
      </Form.Group>
    </Row>
  ))}

  {/* Submit Button */}
  <Row className="justify-content-center">
    <Col xs="auto">
      <Button
        variant=""
        style={{ background: "#FFA500", color: "white" }}
        type="submit"
        className="px-4 py-2"
        disabled={loading}
      >
        {editingId ? "UPDATE POST" : "ADD POST"}
      </Button>
      {editingId && (
        <Button
          variant="secondary"
          className="px-4 py-2 ms-2"
          onClick={() => {
            setEditingId(null);
            setFormData({
              companyName: "",
              companyCategory: "",
              role: "",
              companyLocation: "",
              lastDate: "",
              domain: "",
              jobDescription: "",
              package: "",
              type: "",
              interviewRounds: [],
              gender: "",
              cgpa: "",
              passedOutYear: "",
              acceptedCourse: "",
              jobExplanation: "",
              isOpened: false,
            });
            setNumRounds(0);
            setInterviewRounds([]);
          }}
        >
          CANCEL
        </Button>
      )}
    </Col>
  </Row>
</Form>
      </Card>

      <Container className="mt-5">
        <h1 className="mb-4 text-light">Already Posted</h1>
        <Row>
          {submittedData.map((data, index) => (
            <Col md={4} key={data.id} className="mb-4">
            <Card className="job-card">
              <Card.Body>
                <Card.Title>{data.companyName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {data.domain}
                </Card.Subtitle>
                
                <div className="card-text">
                  <strong>Category:</strong> {data.companyCategory} <br />
                  <strong>Package:</strong> {data.package} <br />
                  <strong>Last Date:</strong> {data.lastDate} <br />
                  <strong>Gender:</strong> {data.gender} <br />
                  <strong>CGPA:</strong> {data.cgpa} <br />
                  <strong>Passed Out Year:</strong> {data.passedOutYear} <br />
                  <strong>Course:</strong> {data.acceptedCourse} <br />
                </div>
                
                <div className="mt-2">
                  <strong>Interview Rounds:</strong>
                  <ul className="mb-3">
                    {data.interviewRounds?.map((round, i) => (
                      <li key={i}>
                        <strong>{round.roundType}:</strong> {round.description}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button variant="warning" onClick={() => handleEdit(data)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(data.id)}>
                  Delete
                </Button>
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
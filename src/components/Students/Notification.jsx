import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Spinner, Alert, Button } from "react-bootstrap";
import NavBar1 from "./NavBarComponent/NavBar1";
import { db } from "../../firebase"; // Adjust path as needed
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Reference to the jobs collection in Firestore
  const jobsCollectionRef = collection(db, "jobs");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(jobsCollectionRef);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Ensure isOpened exists for each job
          isOpened: doc.data().isOpened || false
        }));
        
        // Sort by newest first (assuming you have a createdAt field)
        jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setNotifications(jobsData);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleCardClick = async (job, index) => {
    try {
      // Update in Firebase
      const jobRef = doc(db, "jobs", job.id);
      await updateDoc(jobRef, {
        isOpened: true
      });

      // Update local state
      const updatedJobs = [...notifications];
      updatedJobs[index].isOpened = true;
      setNotifications(updatedJobs);

      navigate("/job-description", { state: { job: updatedJobs[index] } });
    } catch (err) {
      console.error("Error updating notification status:", err);
      // Still navigate even if update fails
      navigate("/job-description", { state: { job } });
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = notifications.map(job => {
        if (!job.isOpened) {
          return updateDoc(doc(db, "jobs", job.id), { isOpened: true });
        }
        return Promise.resolve();
      });

      await Promise.all(batch);
      
      // Update local state
      setNotifications(notifications.map(job => ({
        ...job,
        isOpened: true
      })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <NavBar1 />
      <div className="container mt-3 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-light mb-0">Recent Job Notifications</h3>
          {notifications.some(job => !job.isOpened) && (
            <Button 
              variant="outline-warning" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <Card.Title>No notifications found</Card.Title>
              <Card.Text>
                New job postings will appear here when available.
              </Card.Text>
            </Card.Body>
          </Card>
        ) : (
          notifications.map((job, index) => (
            <Card
              key={job.id}
              onClick={() => handleCardClick(job, index)}
              className="mb-3 shadow-sm"
              style={{
                cursor: "pointer",
                backgroundColor: job.isOpened ? "#f8f9fa" : "#fff3cd",
                borderLeft: job.isOpened ? "4px solid #dee2e6" : "4px solid #ffc107",
                transition: "all 0.2s ease"
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title className="mb-1">
                      {job.companyName}
                      {!job.isOpened && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          New
                        </Badge>
                      )}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {job.role} - {job.domain}
                    </Card.Subtitle>
                  </div>
                  <small className="text-muted">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="d-flex justify-content-between align-items-end mt-2">
                  <Card.Text className="mb-0">
                    <strong>Apply by:</strong> {job.lastDate}
                  </Card.Text>
                  <Badge bg={job.type === "Placement" ? "success" : "info"}>
                    {job.type}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default Notifications;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar1 from "../NavBarComponent/NavBar1";
import { Card, Button, Row, Col } from "react-bootstrap";
import { db } from "../../../firebase"; 
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Reference to the jobs collection in Firestore
  const jobsCollectionRef = collection(db, "jobs");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(jobsCollectionRef);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(jobsData);
        setFilteredData(jobsData);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
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

  if (loading) {
    return (
      <div className="text-center mt-5" style={{ color: "white" }}>
        Loading jobs...
      </div>
    );
  }

  return (
    <>
      <NavBar1 onSearch={handleSearch} />
      <h2 className="my-4 mx-3" style={{ color: "white" }}>Offers</h2>

      {filteredData.length > 0 ? (
        <Row className="mx-3">
          {filteredData.map((item) => (
            <Col md={4} key={item.id} className="mb-4">
              <Card
                className="shadow-lg border-0 rounded-4 p-3"
                style={{
                  background: "#f9f9f9",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Card.Body>
                  <Card.Title className="fs-4 fw-bold text-primary mb-2">
                    <i className="bi bi-building me-2"></i>
                    {item.companyName}
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    <i className="bi bi-diagram-3-fill me-2"></i>
                    {item.domain}
                  </Card.Subtitle>
                  <div className="mb-4">
                    <p className="mb-2">
                      <strong>
                        <i className="bi bi-tag-fill me-2"></i>Category:
                      </strong>{" "}
                      {item.companyCategory}
                    </p>
                    <p className="mb-2">
                      <strong>
                        <i className="bi bi-person-badge-fill me-2"></i>Role:
                      </strong>{" "}
                      {item.role}
                    </p>
                    <p className="mb-2">
                      <strong>
                        <i className="bi bi-currency-rupee me-2"></i>Package:
                      </strong>{" "}
                      {item.package}
                    </p>
                    <p>
                      <strong>
                        <i className="bi bi-calendar-event-fill me-2"></i>Apply by:
                      </strong>{" "}
                      {item.lastDate}
                    </p>
                  </div>
                  <div className="text-end">
                    <Button
                      style={{
                        background: "#FFA500",
                        color: "white",
                        borderRadius: "25px",
                        padding: "8px 20px",
                      }}
                      onClick={() => handleApply(item)}
                    >
                      Apply
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-3" style={{ color: "white" }}>
          {loading ? "Loading..." : "No jobs found"}
        </p>
      )}
    </>
  );
}

export default Home;
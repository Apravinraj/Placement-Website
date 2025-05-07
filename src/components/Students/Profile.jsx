import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import NavBar1 from "./NavBarComponent/NavBar1";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [registerNumber, setRegisterNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 1. Get user document from 'users' collection
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          throw new Error("User document not found");
        }

        const userData = userDocSnap.data();
        const regNumber = userData.registerNumber;
        
        if (!regNumber) {
          throw new Error("Register number not found in user document");
        }

        setRegisterNumber(regNumber);

        // 2. Get student profile from 'students' collection
        const profileDocRef = doc(db, "students", regNumber);
        const profileDocSnap = await getDoc(profileDocRef);
        
        if (!profileDocSnap.exists()) {
          throw new Error("Student profile not found");
        }

        // Combine all profile data
        setProfile({
          ...profileDocSnap.data(),
          registerNumber: regNumber // Ensure registerNumber is included
        });
        
        // Update URL if needed
        if (!location.pathname.includes(regNumber)) {
          navigate(`/profile/${regNumber}`, { replace: true });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Profile</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Profile Not Found</h4>
          <p>Your profile data could not be loaded. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar1/>
      <div className="container mt-4 mb-5">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">My Profile</h2>
            <small>Register Number: {registerNumber || profile.registerNumber || "N/A"}</small>
          </div>
          
          <div className="card-body p-4">
            {/* Personal Details Section */}
            <section className="mb-5">
              <h4 className="mb-3">
                <i className="bi bi-person-fill me-2"></i>
                Personal Details
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {profile.personalDetails?.name || "N/A"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Department:</strong> {profile.personalDetails?.department || "N/A"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Year:</strong> {profile.personalDetails?.year || "N/A"}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Email:</strong> {profile.personalDetails?.email || "N/A"}</p>
                </div>
              </div>
            </section>

            {/* Academic Details Section */}
            <section className="mb-5">
              <h4 className="mb-3">
                <i className="bi bi-book-fill me-2"></i>
                Academic Details
              </h4>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <p><strong>Current Backlogs:</strong> {profile.academicDetails?.currentBacklogs || 0}</p>
                </div>
                <div className="col-md-4">
                  <p><strong>History of Backlogs:</strong> {profile.academicDetails?.historyOfBacklogs || 0}</p>
                </div>
                <div className="col-md-4">
                  <p><strong>Semesters Completed:</strong> {profile.academicDetails?.numberOfSemesters || 0}</p>
                </div>
              </div>

              {profile.academicDetails?.semCgpa?.length > 0 && (
                <div className="mb-4">
                  <h5>Semester-wise Performance</h5>
                  <div className="row g-2">
                    {profile.academicDetails.semCgpa.map((cgpa, index) => (
                      <div key={index} className="col-md-3 col-6">
                        <p>
                          <strong>Sem {index + 1}:</strong> {typeof cgpa === 'number' ? cgpa.toFixed(2) : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="alert alert-success">
                <h5 className="mb-0">
                  <strong>Overall CGPA:</strong> {typeof profile.academicDetails?.overallCgpa === 'number' 
                    ? profile.academicDetails.overallCgpa.toFixed(2) 
                    : "N/A"}
                </h5>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
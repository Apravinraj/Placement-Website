import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Changed from registerNumber to username
    department: "",
    year: "",
    email: "",
    phone: "",
    currentBacklogs: 0,
    historyOfBacklogs: 0,
    numberOfSemesters: 0,
    semCgpa: []
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "numberOfSemesters") {
      const count = parseInt(value) || 0;
      updated.semCgpa = Array(count).fill(0);
    }

    setFormData(updated);
  };

  const handleSemCgpaChange = (index, value) => {
    const cgpaArray = [...formData.semCgpa];
    cgpaArray[index] = parseFloat(value) || 0;
    setFormData({ ...formData, semCgpa: cgpaArray });
  };

  const calculateOverallCgpa = () => {
    if (formData.semCgpa.length === 0) return 0;
    const sum = formData.semCgpa.reduce((a, b) => a + b, 0);
    return (sum / formData.semCgpa.length).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate overall CGPA as a number
      const sum = formData.semCgpa.reduce((a, b) => a + b, 0);
      const avg = formData.semCgpa.length > 0 ? sum / formData.semCgpa.length : 0;
      const overallCgpa = parseFloat(avg.toFixed(2));
  
      const studentData = {
        personalDetails: {
          name: formData.name,
          registerNumber: formData.username, // Using username as registerNumber
          department: formData.department,
          year: formData.year,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString()
        },
        academicDetails: {
          currentBacklogs: parseInt(formData.currentBacklogs) || 0,
          historyOfBacklogs: parseInt(formData.historyOfBacklogs) || 0,
          numberOfSemesters: parseInt(formData.numberOfSemesters) || 0,
          semCgpa: formData.semCgpa,
          overallCgpa: overallCgpa
        }
      };
  
      await setDoc(doc(db, "students", formData.username), studentData); // Using username as document ID
      alert("Registration successful! Please create your login credentials.");
      
      // Navigate to create login page instead of profile
      navigate("/create-login", { 
        state: { 
          registerNumber: formData.username, // Using username as registerNumber
          email: formData.email 
        } 
      });
      
    } catch (error) {
      console.error("Error saving student data:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ background: "#f8f9fa" }}>
        {/* Personal Details */}
        <h5 className="mb-3">Personal Information</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Register Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="username"  // Using username for registerNumber
              placeholder="Register Number"
              value={formData.username}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Department</label>
            <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Year of Admission</label>
            <input type="number" className="form-control" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        {/* Academic Details */}
        <h5 className="mb-3">Academic Information</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Current Backlogs</label>
            <input type="number" className="form-control" name="currentBacklogs" value={formData.currentBacklogs} onChange={handleChange} min="0" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">History of Backlogs</label>
            <input type="number" className="form-control" name="historyOfBacklogs" value={formData.historyOfBacklogs} onChange={handleChange} min="0" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Semesters Completed</label>
            <input type="number" className="form-control" name="numberOfSemesters" value={formData.numberOfSemesters} onChange={handleChange} min="1" max="8" required />
          </div>
        </div>

        {/* Semester CGPA */}
        {formData.semCgpa.length > 0 && (
          <div className="mb-4">
            <label className="form-label">Semester-wise CGPA</label>
            <div className="row g-2">
              {formData.semCgpa.map((cgpa, index) => (
                <div key={index} className="col-md-3 col-6">
                  <label className="form-label">Sem {index + 1}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control"
                    value={cgpa}
                    onChange={(e) => handleSemCgpaChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>

            {formData.semCgpa.length > 0 && (
              <div className="mb-4">
                <div className="alert alert-info">
                  <h5 className="mb-0">
                    <strong>Calculated Overall CGPA:</strong> {calculateOverallCgpa()}
                  </h5>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">Complete Registration</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
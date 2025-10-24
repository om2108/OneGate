import React, { useState } from "react";
import { User, Phone, MapPin, Car, Send } from "lucide-react"; 
import "../style/VisitorEntry.css";

const VisitorEntry = () => {
  const [visitorData, setVisitorData] = useState({
    name: "",
    contactNumber: "",
    purpose: "",
    vehicleNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitorData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Visitor Entry Submitted:", visitorData);
    alert(`Entry recorded for ${visitorData.name} (Contact: ${visitorData.contactNumber})!`);
  };

  return (
    <div className="visitor-entry-container">
      <div className="entry-header">
        <div>
            <h2 className="entry-title">Visitor Entry Log</h2>
            <p className="entry-subtitle">Record new visitor information quickly and efficiently.</p>
        </div>
        <button className="verify-btn">Go to Resident Verification</button>
      </div>

      <div className="info-section">
        <h3 className="section-title">Visitor Information</h3>
        <p className="section-subtitle">Enter the details of the visitor below. All fields are required unless marked optional.</p>
        
        <form onSubmit={handleSubmit} className="entry-form-single-column">
          
          <div className="form-group">
            <label htmlFor="name"><User className="input-icon" size={18} /> Visitor Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={visitorData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber"><Phone className="input-icon" size={18} /> Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={visitorData.contactNumber}
              onChange={handleChange}
              placeholder="e.g., +91 98765 43210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose"><MapPin className="input-icon" size={18} /> Purpose of Visit</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={visitorData.purpose}
              onChange={handleChange}
              placeholder="Meeting Flat 401 Resident"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleNumber"><Car className="input-icon" size={18} /> Vehicle Details (Optional)</label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={visitorData.vehicleNumber}
              onChange={handleChange}
              placeholder="MH 01 AB 1234 (Optional)"
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorEntry;
import React, { useState } from "react";
import "./ResidentVerification.css";

const ResidentVerification = () => {
  const [flat, setFlat] = useState("A-101");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ flat, status, notes });
  };

  return (
    <div className="res-veri">
      {/* Info Box */}
      <div className="info-box">
        <h2 className="title">Resident Verification</h2>
        <p className="subtitle">
          Select a flat number and confirm resident details.
        </p>
      </div>

      {/* Form Box */}
      <form onSubmit={handleSubmit} className="veri-form">
        {/* Flat Number */}
        <div className="form-group">
          <label className="label">Flat Number</label>
          <select
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            className="select"
          >
            <option value="A-101">A-101</option>
            <option value="A-102">A-102</option>
            <option value="B-201">B-201</option>
          </select>
        </div>

        <hr className="divider" />

        {/* Resident Details */}
        <div className="details">
          <h3 className="label">Resident Details</h3>
          <p><span className="bold">Name:</span> Priya Sharma</p>
          <p><span className="bold">Contact:</span> +91 98765 43210</p>
          <p>
            <span className="bold">Status:</span>{" "}
            <span className="occupied">Occupied</span>
          </p>
          <p><span className="bold">Last Verified:</span> 2024-03-15</p>
        </div>

<hr className="divider"  />

        {/* Confirm Status */}
        <div className="form-group">
          <h3 className="label">Confirm Resident Status</h3>
          <label className="radio">
            <input
              type="radio"
              name="status"
              value="Confirmed"
              checked={status === "Confirmed"}
              onChange={(e) => setStatus(e.target.value)}
            />
            Confirmed - Resident is present and verified
          </label>
          <label className="radio">
            <input
              type="radio"
              name="status"
              value="Denied"
              checked={status === "Denied"}
              onChange={(e) => setStatus(e.target.value)}
            />
            Denied - Resident is not present or verification failed
          </label>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="label">Verification Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="textarea"
            rows="3"
            placeholder="Add any specific observations or details..."
          ></textarea>
        </div>

        <hr className="divider" />

        {/* Buttons */}
        <div className="btn-group">
          <button
            type="reset"
            onClick={() => {
              setStatus("");
              setNotes("");
            }}
            className="btn reset"
          >
            Reset
          </button>
          <button type="submit" className="btn submit">
            Submit Verification
          </button>
        </div>
      </form>

      {/* Horizontal line after section */}
      <hr className="divider" />
    </div>
  );
};

export default ResidentVerification;

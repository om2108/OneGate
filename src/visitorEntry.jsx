
import React, { useState } from 'react';
import './visitorEntry.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ResidentVerification from './ResidentVerification.jsx';
import Logs from './Logs.jsx';
import watchmanPhoto from './assets/watchman_photo.jpg';
import applogo from './assets/applogo.png';

function App() {
  const [page, setPage] = useState('Visitor Entry'); // Default page

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="header">
        <div className='app-logo'><img src={applogo} alt="app logo" /></div>
        {/* Desktop header texts */}
        <div className="header-texts">
          <p
            className={`content ${page === 'Visitor Entry' ? 'active' : ''}`}
            
          >
            Visitor Entry
          </p>
          <p
            className={`content ${page === 'ResidentVerification' ? 'active' : ''}`}
            
          >
            Resident Verification
          </p>
          <p
            className={`content ${page === 'Logs' ? 'active' : ''}`}
            
          >
            Logs
          </p>
        </div>

        {/* Watchman photo */}
        <div className="photo-container">
          <img src={watchmanPhoto} alt="Watchman" className="photo" />
        </div>

        {/* Mobile header buttons */}
        <div className="header-nav">
          <button
            className={page === 'Visitor Entry' ? 'active' : ''}
            onClick={() => setPage('Visitor Entry')}
          >
            <i className="bi bi-upc-scan"></i> Visitor Entry
          </button>
          <button
            className={page === 'ResidentVerification' ? 'active' : ''}
            onClick={() => setPage('ResidentVerification')}
          >
            <i className="bi bi-person-check"></i> Resident Verification
          </button>
          <button
            className={page === 'Logs' ? 'active' : ''}
            onClick={() => setPage('Logs')}
          >
            <i className="bi bi-file-earmark-text"></i> Logs
          </button>
        </div>
      </div>

      {/* ===== Layout ===== */}
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={page === 'Visitor Entry' ? 'active' : ''}
            onClick={() => setPage('Visitor Entry')}
          >
            <i className="bi bi-upc-scan"></i> Visitor Entry
          </button>
          <button
            className={page === 'ResidentVerification' ? 'active' : ''}
            onClick={() => setPage('ResidentVerification')}
          >
            <i className="bi bi-person-check"></i> Resident Verification
          </button>
          <button
            className={page === 'Logs' ? 'active' : ''}
            onClick={() => setPage('Logs')}
          >
            <i className="bi bi-file-earmark-text"></i> Logs
          </button>
        </div>

        {/* Main content */}
        <div className="main-content">
          {page === 'Visitor Entry' && (
            <div className="form-container">
              <div className="top-section">
                <div>
                  <h2>Visitor Log Entry</h2>
                  <p>Record new visitor information quickly and efficiently.</p>
                </div>
                <button
                  className="right-button"
                  onClick={() => setPage('ResidentVerification')}
                >
                  Go To Resident Verification
                </button>
              </div>

      <br />
              <div className="form">
                <div className="upper-section">
                  <h3>Visitor Information</h3>
                  <p>
                    Enter the details of visitor below. All fields are mandatory unless
                    marked optional.
                  </p>
                </div>
                <div className="lower-section">
                  <form>
                    <label htmlFor="visitorName">Visitor Name:</label>
                    <input type="text" id="visitorName" name="visitorName" required />

                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="tel" id="contactNumber" name="contactNumber" required />

                    <label htmlFor="purposeOfVisit">Purpose of Visit:</label>
                    <textarea id="purposeOfVisit" name="purposeOfVisit" required></textarea>

                    <label htmlFor="vehicleDetails">Vehicle Details (Optional):</label>
                    <input type="text" id="vehicleDetails" name="vehicleDetails" />

                    <button type="submit">Submit Entry</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {page === 'ResidentVerification' && <ResidentVerification />}
          {page === 'Logs' && <Logs />}
        </div>
      </div>
    </div>
  );
}

export default App;

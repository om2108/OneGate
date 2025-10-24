
import React, { useState } from "react";
import { Search, Home, User, Phone, Clock, CheckCircle, AlertCircle } from "lucide-react"; 
import "../style/ResidentVerification.css"; 
import RESIDENTS_MOCK_DATA from "../data/residentData.json"; 

const ResidentVerification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [residentData, setResidentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [statusConfirmed, setStatusConfirmed] = useState('confirmed');
  const [verificationNotes, setVerificationNotes] = useState('');


  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();

    if (!query) return;

    setIsLoading(true);
    setResidentData(null); 

    setTimeout(() => {
      const data = RESIDENTS_MOCK_DATA[query];
      
      setStatusConfirmed('confirmed'); 
      setVerificationNotes(''); 

      setResidentData(data || { error: `No resident found for unit ${query}` });
      setIsLoading(false);
    }, 800);
  };

  const isDataValid = residentData && !residentData.error;

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    if (!isDataValid) return; 

    console.log("Verification Submitted (API Placeholder):", {
        flat: residentData.flatNumber,
        status: statusConfirmed,
        notes: verificationNotes
    });
    alert(`Verification logged for ${residentData.flatNumber}. Status: ${statusConfirmed}`);

    setSearchQuery('');
    setResidentData(null);
  };

  return (
    <div className="verification-container">
      
      <div className="verify-header">
        <h2>Resident Verification</h2>
        <p>Enter the flat number to retrieve and confirm resident details.</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Enter Flat/Unit Number (e.g., A-101)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    required
                />
            </div>
            <button type="submit" className="search-btn" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search Resident'}
            </button>
        </form>
      </div>

      <div className="results-section">
        {isLoading && (
            <div className="loading-message">Loading Resident Data...</div>
        )}

        {residentData && residentData.error && (
            <div className="error-message">
                <h3>Search Failed</h3>
                <p>{residentData.error}</p>
            </div>
        )}

        {isDataValid && (
          <form onSubmit={handleSubmitVerification} className="resident-verification-form">
            <div className="form-section resident-details-card">
              <div className="card-header-status">
                  <CheckCircle className="status-icon" />
                  <h3>RESIDENT FOUND - {residentData.flatNumber}</h3>
              </div>
              
              <div className="details-grid">
                  <span className="detail-label"><User size={20} className="detail-icon" /> Name:</span>
                  <span className="detail-value">{residentData.name}</span>

                  <span className="detail-label"><Phone size={20} className="detail-icon" /> Contact:</span>
                  <span className="detail-value">{residentData.contact}</span>

                  <span className="detail-label"><Home size={20} className="detail-icon" /> Status:</span>
                  <span className={`detail-value status-${residentData.status.toLowerCase()}`}>
                      {residentData.status}
                  </span>

                  <span className="detail-label"><Clock size={20} className="detail-icon" /> Last Visitor:</span>
                  <span className="detail-value">{residentData.lastVisitor}</span>
              </div>

              <div className="card-footer">
                  <p>Active Guests: <span className={`guest-count ${residentData.activeGuests > 0 ? 'alert' : ''}`}>{residentData.activeGuests}</span></p>
              </div>
            </div>

            <div className="form-section confirmation-section">
                <h3>Verification Confirmation</h3>

                <div className="radio-group">
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            name="status" 
                            value="confirmed" 
                            checked={statusConfirmed === 'confirmed'}
                            onChange={() => setStatusConfirmed('confirmed')}
                        />
                        <CheckCircle size={18} className="radio-icon confirm-icon" />
                        Confirmed - Resident is present and verified
                    </label>

                    <label className="radio-label">
                        <input 
                            type="radio" 
                            name="status" 
                            value="denied" 
                            checked={statusConfirmed === 'denied'}
                            onChange={() => setStatusConfirmed('denied')}
                        />
                        <AlertCircle size={18} className="radio-icon deny-icon" />
                        Denied - Resident is not present or verification failed
                    </label>
                </div>

                <label className="rv-label optional-label">Verification Notes (Optional)</label>
                <textarea
                    placeholder="Add any specific observations or details..."
                    rows="4"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="rv-textarea"
                />

                <div className="form-actions">
                    <button type="button" className="reset-btn" onClick={() => setVerificationNotes('')}>Reset Notes</button>
                    <button type="submit" className="submit-btn">Submit Verification</button>
                </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResidentVerification;
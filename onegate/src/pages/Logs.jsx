import React from 'react';
import logEntries from '../data/LogsData.json'; 
import '../style/Logs.css'; 

const Logs = () => {

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Checked In':
        return 'status-checked-in';
      case 'Verified':
        return 'status-verified';
      case 'Checked Out':
        return 'status-checked-out';
      default:
        return '';
    }
  };

  return (
    <div className="property-hub-logs-layout">
      
      
      <div className="main-content-area">

        <main className="logs-panel-content">
          <h1>Watchman Panel Logs</h1>
          
          <div className="log-controls-card">
            <h2 className="card-title">Log Controls</h2>
            <p className="card-subtitle">Filter and manage log entries.</p>
            
            <div className="controls-group">
              <div className="control-item">
                <label>From Date</label>
                <input type="date"    />
              </div>
              <div className="control-item">
                <label>To Date</label>
                <input type="date"  />
              </div>
              <div className="control-item">
                <label>Entry Type</label>
                <select>
                  <option>All Types</option>
                  <option>Visitor Entry</option>
                  <option>Resident Verification</option>
                </select>
              </div>
              
              <div className="control-buttons">
                <button className="export-button">Export Report</button>
                <button className="download-button">Download Report</button>
              </div>
            </div>
          </div>

          <div className="log-entries-card">
            <h2 className="card-title">Recent Log Entries</h2>
            <p className="card-subtitle">Overview of all recorded activities.</p>
            
            <table className="log-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>TYPE</th>
                  <th>NAME</th>
                  <th>CONTACT</th>
                  <th>PURPOSE/RESULT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {logEntries.map((log, index) => (
                  <tr key={index}>
                    <td>{log.date}</td>
                    <td>{log.time}</td>
                    <td>{log.type}</td>
                    <td><strong>{log.name}</strong></td>
                    <td>{log.contact}</td>
                    <td>{log.purpose}</td>
                    <td>
                      <span className={`status-badge ${getStatusClassName(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Logs;
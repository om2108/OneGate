import React from "react";
import "./Logs.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Logs() {
  return (
    <div className="logs">
      {/* Title Row with Search */}
      <div className="logs-header">
        <h2 className="logs-title">Watchman Panel Logs</h2>
        <div className="search-box">
          <button id="search-btn">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Search logs by name,contact ..." className="search-input" />
          </button>
        </div>
      </div>

      {/* Log Controls */}
      <div className="logs-controls">
        <h3 className="controls-title">Log Controls</h3>
        <p className="controls-subtitle">Filter and manage log entries.</p>

        <div className="controls-grid">
          <div className="field">
            <p>From Date</p>
            <input type="date" className="input" placeholder="From Date" onFocus={(e)=>e.target.showPicker?.()} />
          </div>
          <div className="field">
            <p>To Date</p>
            <input type="date" className="input" placeholder="To Date" onFocus={(e)=>e.target.showPicker?.()} />
          </div>
          <div className="field">
            <p>Entry Type</p>
            <select className="input">
              
              <option value="">All Types</option>
              <option>Visitor Entry</option>
              <option>Resident Verification</option>
            </select>
          </div>
        </div>

        <div className="action-box">
          <button className="btn outline">
          <i class="bi bi-download"></i> Export Report
          </button>
          <button className="btn primary">
           <i class="bi bi-file-earmark-text"></i> Download Report
          </button>
        </div>
      </div>

      {/* Recent Log Entries */}
      <div className="logs-table">
        <h3 className="table-title">Recent Log Entries</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Purpose/Result</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-07-26</td>
              <td>10:30 AM</td>
              <td>Visitor Entry</td>
              <td>radha</td>
              <td>123-456-7890</td>
              <td>Meeting with Apt 101</td>
              <td><span className="status in">Checked In</span></td>
            </tr>
            <tr>
              <td>2024-07-26</td>
              <td>11:15 AM</td>
              <td>Resident Verification</td>
              <td>ramesh</td>
              <td>987-654-3210</td>
              <td>Access to Gym</td>
              <td><span className="status ok">Verified</span></td>
            </tr>
            <tr>
              <td>2024-07-26</td>
              <td>01:45 PM</td>
              <td>Visitor Entry</td>
              <td>karan</td>
              <td>555-123-4567</td>
              <td>Delivery for Apt 203</td>
              <td><span className="status out">Checked Out</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;

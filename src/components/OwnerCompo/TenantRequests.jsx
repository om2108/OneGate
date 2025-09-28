import React, { useState } from "react";
import "../../style/Ownercss/TenantRequests.css";
import Layout from "../Layout/OwnerLayout";

const requestsData = [
  {
    id: 1,
    tenant: "Alice Smith",
    property: "Maple Apt 201",
    type: "Lease Application",
    date: "2024-07-28",
    status: "Pending",
  },
  {
    id: 2,
    tenant: "Bob Johnson",
    property: "Oak House 12A",
    type: "Property Inquiry",
    date: "2024-07-27",
    status: "Pending",
  },
  {
    id: 3,
    tenant: "Charlie Brown",
    property: "Pine Condo 303",
    type: "Maintenance Request",
    date: "2024-07-26",
    status: "Pending",
  },
  {
    id: 4,
    tenant: "Diana Prince",
    property: "Elm Villa 4B",
    type: "Lease Renewal",
    date: "2024-07-25",
    status: "Pending",
  },
  {
    id: 5,
    tenant: "Clark Kent",
    property: "Birch Tower 10A",
    type: "Property Viewing",
    date: "2024-07-24",
    status: "Pending",
  },
];

export default function TenantRequests() {
  const [activeTab, setActiveTab] = useState("pending");

  const filteredRequests = requestsData.filter(req =>
    activeTab === "pending" ? req.status === "Pending" : req.status !== "Pending"
  );

  return (
    <div className="tenant-requests-container">
      <h2>Tenant and Request Management</h2>
      
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={activeTab === "processed" ? "active" : ""}
          onClick={() => setActiveTab("processed")}
        >
          Processed Requests
        </button>
      </div>

      <div className="table-responsive">
        <table className="tenant-table">
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Property</th>
              <th>Request Type</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr key={req.id}>
                <td>{req.tenant}</td>
                <td>{req.property}</td>
                <td>{req.type}</td>
                <td>{req.date}</td>
                <td>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="approve-btn">Approve</button>
                  <button className="reject-btn">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

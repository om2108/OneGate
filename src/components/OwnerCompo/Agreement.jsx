import React from "react";
import "../../style/Ownercss/Agreement.css";

const tenants = [
  {
    id: 1,
    name: "John Doe",
    property: "Apartment 12B, Sunshine Residency",
    rent: "$1200/month",
    leaseStart: "2025-10-01",
    leaseEnd: "2026-09-30",
  },
  {
    id: 2,
    name: "Jane Smith",
    property: "Apartment 8A, Lakeview Towers",
    rent: "$1500/month",
    leaseStart: "2025-11-01",
    leaseEnd: "2026-10-31",
  },
  {
    id: 3,
    name: "Mark Wilson",
    property: "Villa 5, Green Acres",
    rent: "$2500/month",
    leaseStart: "2025-09-15",
    leaseEnd: "2026-09-14",
  },
];

export default function TenantAgreementList() {
  return (
    <section className="tenant-agreement-list">
      <h3>Tenant Agreements</h3>
      <div className="tenant-cards">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="tenant-card">
            <p><strong>Name:</strong> {tenant.name}</p>
            <p><strong>Property:</strong> {tenant.property}</p>
            <p><strong>Rent:</strong> {tenant.rent}</p>
            <p><strong>Lease:</strong> {tenant.leaseStart} to {tenant.leaseEnd}</p>
            <div className="agreement-actions">
              <button className="view-btn">View Agreement</button>
              <button className="approve-btn">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

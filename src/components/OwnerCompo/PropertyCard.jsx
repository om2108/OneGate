import React from "react";
import "../../style/Ownercss/PropertyCard.css";

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.name} />
      <div className="property-info">
        <h4>{property.name}</h4>
        <p className="address">{property.address}</p>
        <p>Units: {property.units}</p>
        <span className={`status ${property.status.toLowerCase().replace(" ", "-")}`}>
          {property.status}
        </span>
        <div className="actions">
          <button className="view-btn">View Details</button>
          <button className="edit-btn">Edit</button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import "../../../style/Ownercss/Properties.css";
export default function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.name} />
      <div className="property-info">
        <h4>{property.name}</h4>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Status:</strong> {property.status}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>BHK:</strong> {property.bhk}</p>

        {onEdit && onDelete && (
          <div className="owner-actions">
            <button className="edit-btn" onClick={() => onEdit(property.id)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(property.id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

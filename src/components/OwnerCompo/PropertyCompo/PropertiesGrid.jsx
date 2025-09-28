import React from "react";
import PropertyCard from "./PropertiesCards";
import "../../../style/Ownercss/Properties.css";

export default function PropertiesGrid({ properties, onEdit, onDelete }) {
  return (
    <div className="properties-grid">
      {properties.length > 0 ? (
        properties.map((p) => (
          <PropertyCard key={p.id} property={p} onEdit={onEdit} onDelete={onDelete} />
        ))
      ) : (
        <p className="no-results">No properties found.</p>
      )}
    </div>
  );
}

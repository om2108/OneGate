import React from "react";
import Layout from "../Layout/OwnerLayout";
import Greeting from "./Greeting";
import PropertyCard from "./PropertyCard";
import Payments from "./Payments";
import Rightbar from "./Rightbar";
import properties from "../../data/propertiesdata";
import "../../style/Ownercss/Dashboard.css";

export default function Dashboard() {
  return (
      <div className="dashboard-main-with-rightbar">
        <div className="dashboard-left">
          <Greeting />

          <h3 className="section-title">My Properties</h3>
          <div className="property-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <Payments />
        </div>

        <Rightbar />
      </div>

  );
}

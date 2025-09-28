import React from "react";
import "../../style/Ownercss/Greeting.css";

export default function Greeting() {
  return (
    <section className="greeting">
      <div>
        <h2>Good morning, Owner</h2>
        <p>Manage your properties and tenants easily.</p>
      </div>
      <button className="add-btn">+ Add property</button>
    </section>
  );
}

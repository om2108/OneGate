
import React from "react";
import "../style/header.css";
import { UserCircle } from "lucide-react";

const header = ({ activePage }) => {
  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="logo">ONEGATE</h1>

        <nav className="header-nav">
          <span
            className={`nav-item ${activePage === "visitor" ? "active" : ""}`}
          >
            Visitor Entry
          </span>
          <span
            className={`nav-item ${activePage === "resident" ? "active" : ""}`}
          >
            Resident Verification
          </span>
          <span
            className={`nav-item ${activePage === "logs" ? "active" : ""}`}
          >
            Logs
          </span>
        </nav>
      </div>

      <div className="header-right">
        <div className="profile-icon">
          <UserCircle className="icon" />
        </div>
      </div>
    </header>
  );
};

export default header;

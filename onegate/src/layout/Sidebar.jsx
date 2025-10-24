import React from "react";
import "../style/sidebar.css";

import { Users, FileText, Settings } from "lucide-react"; 

const Sidebar = ({ activePage, onPageChange }) => { 
  return (
    <aside className="sidebar-container">

      <nav className="sidebar-nav">
        
        <div 
          className={`sidebar-item ${activePage === "visitor" ? "active" : ""}`}
          onClick={() => onPageChange("visitor")} 
        >
          <Users className="sidebar-icon" />
          <span>Visitor Entry</span>
        </div>

        <div 
          className={`sidebar-item ${activePage === "resident" ? "active" : ""}`}
          onClick={() => onPageChange("resident")} 
        >
          <FileText className="sidebar-icon" />
          <span>Resident Verification</span>
        </div>

        <div 
          className={`sidebar-item ${activePage === "logs" ? "active" : ""}`}
          onClick={() => onPageChange("logs")} 
        >
          <Settings className="sidebar-icon" />
          <span>Logs</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
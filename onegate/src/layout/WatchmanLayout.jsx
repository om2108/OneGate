
import React, { useState } from "react"; 
import Header from "./header.jsx";
import Sidebar from "./Sidebar.jsx";
import VisitorEntry from "../pages/VisitorEntry.jsx";
import Logs from "../pages/Logs.jsx"; 
import ResidentVerification from "../pages/ResidentVerification.jsx"; 

import "../style/watchmanlayout.css";

const WatchmanLayout = () => { 
  const [activePage, setActivePage] = useState("visitor"); 
  console.log("Active Page:", activePage); 

  const handlePageChange = (pageName) => {
    setActivePage(pageName);
  };

  const renderMainContent = () => {
    switch (activePage) {
      case "visitor":
        return <VisitorEntry />;
      case "resident":
        return <ResidentVerification />;
      case "logs":
        return <Logs />; 
      default:
        return <VisitorEntry />; 
    }
  };

  return (
    <div className="layout-container">
      <Header activePage={activePage} onPageChange={handlePageChange} />

      <Sidebar activePage={activePage} onPageChange={handlePageChange} />

      <main className="layout-content">
        {renderMainContent()} 
      </main>
    </div>
  );
};

export default WatchmanLayout;
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Dashboard from "../OwnerCompo/Dashboard";
import Properties from "../OwnerCompo/Properties";
import TenantRequest from "../OwnerCompo/TenantRequests";
import Agreements from "../OwnerCompo/Agreement";
import "../../style/Layoutcss/OwnerLayout.css";

export default function OwnerLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "properties": return <Properties />;
      case "tenants": return <TenantRequest />;
      case "agreements": return <Agreements />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="layout-container">
      <Header />
      <div className="layout-content">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="layout-main">{renderContent()}</main>
      </div>
    </div>
  );
}

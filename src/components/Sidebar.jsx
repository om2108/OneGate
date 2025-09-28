import React from "react";
import "../style/Sidebar.css";

export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "properties", icon: "📑", label: "Properties" },
    { id: "tenants", icon: "👥", label: "Tenants & Requests" },
    { id: "agreements", icon: "📄", label: "Agreements" },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`icon ${activePage === item.id ? "active" : ""}`}
          onClick={() => setActivePage(item.id)}
          data-label={item.label}
        >
          {item.icon}
        </div>
      ))}
    </aside>
  );
}

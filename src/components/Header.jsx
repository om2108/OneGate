import React from "react";
import "../style/Header.css";
import { CgProfile } from "react-icons/cg";
import logoImg from "../assets/logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoImg} alt="OneGate Logo" />
      </div>

      <div className="searchbar-wrapper">
        <input
          type="text"
          className="searchbar"
          placeholder="Search properties, tenants, and payments"
        />
      </div>

      <div className="profile">
        <CgProfile size={28} />
      </div>
    </header>
  );
}

import React from "react";
import "../../../style/Ownercss/Properties.css";

export default function PropertyFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="property-filters">
      <h3>Filters</h3>

      <div className="filter-group">
        <p>Location</p>
        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={filters.location}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <p>Type</p>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All</option>
          <option value="Rent">Rent</option>
          <option value="Buy">Buy</option>
        </select>
      </div>

      <div className="filter-group">
        <p>Status</p>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="filter-group">
        <p>Price Range</p>
        <input
          type="number"
          name="minPrice"
          placeholder="Min"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

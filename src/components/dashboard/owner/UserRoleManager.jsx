import React, { memo } from "react";

function PropertyFilters({ filters, setFilters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters); // trigger API fetch or parent update
  };

  const filterOptions = {
    type: ["Rent", "Buy"],
    status: ["Available", "Sold", "Pending"],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 flex-wrap">
        {/* Location */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            {filterOptions.type.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            {filterOptions.status.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PropertyFilters);

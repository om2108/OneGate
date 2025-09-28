import React, { useState } from "react";
import PropertyFilters from "./PropertyCompo/PropertyFilters";
import PropertiesGrid from "./PropertyCompo/PropertiesGrid";
import propertiesData from "../../data/propertiesdata"; 
import "../../style/Ownercss/Properties.css";

export default function Properties() {
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  const filteredProperties = propertiesData.filter((p) => {
    const matchesLocation = !filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.type || p.type === filters.type;
    const matchesStatus = !filters.status || p.status === filters.status;
    const matchesMinPrice = !filters.minPrice || p.price >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || p.price <= Number(filters.maxPrice);

    return matchesLocation && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="properties-page">
      <PropertyFilters filters={filters} setFilters={setFilters} />
      <PropertiesGrid properties={filteredProperties} />
    </div>
  );
}

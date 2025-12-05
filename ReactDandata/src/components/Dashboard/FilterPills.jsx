import React from "react";
const FilterPills = ({ activeFilter, onFilterChange, categories }) => (
  <div className="filters">
    {categories.map((filter) => (
      <button
        key={filter.id}
        className={`pill ${activeFilter === filter.id ? "active" : ""}`}
        onClick={() => onFilterChange(filter.id)}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

export default FilterPills;

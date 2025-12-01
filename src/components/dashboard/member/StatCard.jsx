// src/components/common/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, subtitle, small }) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm border border-gray-100 ${small ? "p-3" : ""}`}>
      <div className="text-xs text-gray-500">{title}</div>
      <div className={`mt-2 ${small ? "text-lg" : "text-2xl"} font-semibold text-gray-900`}>
        {value}
      </div>
      {subtitle && <div className="mt-1 text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
}

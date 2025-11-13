import React, { memo } from "react";

/**
 * Small feed of recent actions
 * items = [{id, text, time}]
 */
const RecentActivity = memo(function RecentActivity({ items = [] }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <button className="text-sm text-blue-600">View all</button>
      </div>

      <ul className="space-y-2 text-sm text-gray-700">
        {items.length === 0 ? (
          <li className="text-gray-500">No recent activity</li>
        ) : (
          items.map((it) => (
            <li key={it.id} className="flex items-start justify-between">
              <div className="truncate">
                <div className="text-sm text-gray-900">{it.text}</div>
                <div className="text-xs text-gray-400">{it.time}</div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
});

export default RecentActivity;

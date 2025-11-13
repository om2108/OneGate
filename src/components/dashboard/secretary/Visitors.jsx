import React, { useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Visitors() {
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const visitors = [
    {
      id: 1,
      name: "Alex Johnson",
      flat: "101, Wing A",
      type: "Delivery",
      status: "Pending",
      purpose: "Delivery of groceries",
      time: "3:00 PM - 3:30 PM",
      contact: "9876543210",
      email: "visitor@example.com",
    },
    {
      id: 2,
      name: "Priya Singh",
      flat: "202, Wing B",
      type: "Guest",
      status: "Approved",
      purpose: "Visiting relative",
      time: "5:30 PM - 6:30 PM",
      contact: "9988776655",
      email: "priya@example.com",
    },
  ];

  const visitorTypeData = useMemo(
    () => ({
      labels: ["Delivery", "Guest", "Service"],
      datasets: [
        {
          data: [20, 15, 10],
          backgroundColor: ["#10b981", "#3b82f6", "#f97316"],
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  const visitorTrendData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Visitors",
          data: [5, 7, 6, 8, 10, 4, 5],
          backgroundColor: "#6366f1",
          borderRadius: 6,
        },
      ],
    }),
    []
  );

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="date" className="border rounded-md p-2 text-sm" />
        <select className="border rounded-md p-2 text-sm">
          <option>Visitor Type</option>
          <option>Delivery</option>
          <option>Guest</option>
          <option>Service</option>
        </select>
        <select className="border rounded-md p-2 text-sm">
          <option>Flat Number</option>
          <option>101</option>
          <option>202</option>
        </select>
        <select className="border rounded-md p-2 text-sm">
          <option>Status</option>
          <option>Approved</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitors Today", value: 45 },
          { label: "Pending Visitors", value: 12 },
          { label: "Approved Visitors", value: 33 },
          { label: "Visitor Complaints", value: 3 },
        ].map((card, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-semibold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Visitor Types</h3>
          <Doughnut data={visitorTypeData} options={{ plugins: { legend: { position: "bottom" } } }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Weekly Visitor Trend</h3>
          <Bar
            data={visitorTrendData}
            options={{ plugins: { legend: { display: false } }, responsive: true }}
          />
        </div>
      </div>

      {/* Visitor List */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Visitor Directory</h2>
        {visitors.map((v) => (
          <div
            key={v.id}
            className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <h4 className="font-semibold">{v.name}</h4>
              <p className="text-sm text-gray-500">{v.flat}</p>
              <p className="text-xs text-gray-400">{v.type} | {v.status}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedVisitor(v)}
                className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
              >
                View
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                Call
              </button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                Email
              </button>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                Approve
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Modal */}
      {selectedVisitor && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedVisitor(null)}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setSelectedVisitor(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">{selectedVisitor.name}</h2>
            <p><strong>Flat:</strong> {selectedVisitor.flat}</p>
            <p><strong>Visitor Type:</strong> {selectedVisitor.type}</p>
            <p><strong>Status:</strong> {selectedVisitor.status}</p>
            <p><strong>Contact:</strong> {selectedVisitor.contact}</p>
            <p><strong>Email:</strong> {selectedVisitor.email}</p>
            <p><strong>Visit Purpose:</strong> {selectedVisitor.purpose}</p>
            <p><strong>Visit Time:</strong> {selectedVisitor.time}</p>
            <p><strong>Remarks:</strong> No issues</p>
          </div>
        </div>
      )}
    </div>
  );
}

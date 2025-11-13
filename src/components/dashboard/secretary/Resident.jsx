import React, { useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Resident() {
  // Resident data
  const [residents] = useState([
    {
      name: "John Doe",
      flat: "Flat 101, Wing A",
      ownership: "Owner",
      members: 3,
      contact: "9876543210",
      email: "resident@example.com",
      complaints: "None",
      payment: "Paid up to Sep 2025",
      bookings: "Gym, Party Hall",
    },
    {
      name: "Riya Patel",
      flat: "Flat 202, Wing B",
      ownership: "Tenant",
      members: 2,
      contact: "9123456789",
      email: "riya@example.com",
      complaints: "1 Pending",
      payment: "Paid up to Oct 2025",
      bookings: "Swimming Pool",
    },
  ]);

  // Filters
  const [search, setSearch] = useState("");
  const [wing, setWing] = useState("All");
  const [flatType, setFlatType] = useState("All");
  const [ownership, setOwnership] = useState("All");

  // Modal
  const [selectedResident, setSelectedResident] = useState(null);

  // Filtered list
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.flat.toLowerCase().includes(search.toLowerCase());
      const matchWing = wing === "All" || r.flat.includes(wing);
      const matchOwnership = ownership === "All" || r.ownership === ownership;
      return matchSearch && matchWing && matchOwnership;
    });
  }, [residents, search, wing, ownership]);

  // Chart data
  const flatData = {
    labels: ["Sold Flats", "Vacant Flats"],
    datasets: [
      {
        data: [850, 398],
        backgroundColor: ["#10b981", "#f97316"],
      },
    ],
  };

  const memberData = {
    labels: ["Wing A", "Wing B", "Wing C"],
    datasets: [
      {
        label: "Members per Flat",
        data: [3, 2, 4],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Top Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name or flat number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-64"
        />
        <select
          value={wing}
          onChange={(e) => setWing(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Wing A</option>
          <option>Wing B</option>
          <option>Wing C</option>
        </select>
        <select
          value={flatType}
          onChange={(e) => setFlatType(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
        </select>
        <select
          value={ownership}
          onChange={(e) => setOwnership(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Owner</option>
          <option>Tenant</option>
        </select>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Flats", value: "1,248" },
          { label: "Sold Flats", value: "850" },
          { label: "Vacant Flats", value: "398" },
          { label: "Total Residents", value: "3,120" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{card.label}</p>
            <h3 className="text-xl font-semibold mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* 📈 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Flat Status</h3>
          <Doughnut data={flatData} options={{ plugins: { legend: { position: "bottom" } } }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Members per Wing</h3>
          <Bar
            data={memberData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      {/* 👥 Resident List */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Resident Directory</h2>

        {filteredResidents.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow flex justify-between items-center mb-3 hover:translate-y-[-2px] transition"
          >
            <div>
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm text-gray-600">{r.flat}</p>
              <p className="text-xs text-gray-500">
                {r.ownership} | Members: {r.members}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setSelectedResident(r)}
                className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
              >
                View
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                📞
              </button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                📧
              </button>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                💬
              </button>
            </div>
          </div>
        ))}

        {filteredResidents.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            No residents found matching your filters.
          </p>
        )}
      </section>

      {/* 🪟 Modal */}
      {selectedResident && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedResident(null)}
        >
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">{selectedResident.name}</h2>
            <p><strong>Flat:</strong> {selectedResident.flat}</p>
            <p><strong>Ownership:</strong> {selectedResident.ownership}</p>
            <p><strong>Members:</strong> {selectedResident.members}</p>
            <p><strong>Contact:</strong> {selectedResident.contact}</p>
            <p><strong>Email:</strong> {selectedResident.email}</p>
            <p><strong>Complaint History:</strong> {selectedResident.complaints}</p>
            <p><strong>Payment History:</strong> {selectedResident.payment}</p>
            <p><strong>Booking History:</strong> {selectedResident.bookings}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedResident(null)}
                className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

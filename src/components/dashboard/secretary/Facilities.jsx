import React, { useState, useMemo, memo } from "react";

function Facilities() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const facilities = [
    { id: 1, name: "Party Hall", capacity: 50, wing: "A", status: "Booked", bookedBy: "Rahul Sharma (Flat 102)", date: "25 Sep 2025", maintenance: "Monthly", remarks: "Needs regular cleaning" },
    { id: 2, name: "Gym", capacity: 30, wing: "B", status: "Available", bookedBy: "None", date: "-", maintenance: "Weekly", remarks: "All equipment functional" },
    { id: 3, name: "Swimming Pool", capacity: 20, wing: "C", status: "Booked", bookedBy: "Kiran Mehta (Flat 305)", date: "20 Sep 2025", maintenance: "Bi-weekly", remarks: "Clean water maintained" },
  ];

  // Filter logic
  const filteredFacilities = useMemo(() => {
    return facilities.filter(f =>
      (!search || f.name.toLowerCase().includes(search.toLowerCase())) &&
      (!typeFilter || f.name === typeFilter) &&
      (!statusFilter || f.status === statusFilter)
    );
  }, [search, typeFilter, statusFilter, facilities]);

  return (
    <div className="p-4 space-y-6">
      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Facilities", value: facilities.length },
          { label: "Available Facilities", value: facilities.filter(f => f.status === "Available").length },
          { label: "Bookings Today", value: 5 },
          { label: "Pending Requests", value: 2 },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md p-2 text-sm w-full sm:w-44"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">Facility Type</option>
          {[...new Set(facilities.map(f => f.name))].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">Status</option>
          <option>Available</option>
          <option>Booked</option>
        </select>
      </div>

      {/* Facility List */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Facility Directory</h2>
        {filteredFacilities.length ? (
          filteredFacilities.map(f => (
            <div key={f.id} className="bg-white shadow rounded-lg p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition">
              <div className="flex-1 mb-3 sm:mb-0">
                <h4 className="font-semibold">{f.name}</h4>
                <p className="text-sm text-gray-500">
                  Capacity: {f.capacity} | Wing {f.wing} | Status:{" "}
                  <span className={`font-medium ${f.status === "Available" ? "text-green-600" : "text-orange-600"}`}>{f.status}</span>
                </p>
                <p className="text-xs text-gray-400">
                  <strong>Booked By:</strong> {f.bookedBy} {f.date !== "-" && `on ${f.date}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedFacility(f)} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600">View</button>
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">📅 Book</button>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">✅ Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">❌ Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-4">No facilities found.</p>
        )}
      </section>

      {/* Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4" onClick={e => e.target === e.currentTarget && setSelectedFacility(null)}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setSelectedFacility(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>

            <h2 className="text-xl font-semibold mb-2">{selectedFacility.name}</h2>
            <p><strong>Location:</strong> Wing {selectedFacility.wing}</p>
            <p><strong>Status:</strong> <span className={`${selectedFacility.status === "Available" ? "text-green-600" : "text-orange-600"} font-medium`}>{selectedFacility.status}</span></p>
            <p><strong>Capacity:</strong> {selectedFacility.capacity} persons</p>
            <p><strong>Booked By:</strong> {selectedFacility.bookedBy} {selectedFacility.date !== "-" && `on ${selectedFacility.date}`}</p>
            <p><strong>Maintenance Schedule:</strong> {selectedFacility.maintenance}</p>
            <p><strong>Remarks:</strong> {selectedFacility.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Facilities);

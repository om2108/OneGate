import React, { useState, useMemo, memo } from "react";

function Reports() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    { id: 1, name: "Resident Occupancy", date: "28 Sep 2025", status: "Completed", type: "Residents" },
    { id: 2, name: "Visitor Analysis", date: "28 Sep 2025", status: "Pending", type: "Visitors" },
    { id: 3, name: "Facility Usage", date: "27 Sep 2025", status: "Completed", type: "Facilities" },
  ];

  const filteredReports = useMemo(() => {
    return reports.filter(r =>
      (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
      (!typeFilter || r.type === typeFilter) &&
      (!dateFilter || dateFilter === "All" || r.date.includes(dateFilter))
    );
  }, [search, typeFilter, dateFilter, reports]);

  const handleExport = () => alert("📊 Exporting reports to Excel...");
  const handlePrint = () => window.print();

  const summaryCards = [
    { label: "Total Reports", value: reports.length, color: "from-indigo-500 to-purple-500" },
    { label: "Completed Reports", value: reports.filter(r => r.status === "Completed").length, color: "from-green-500 to-emerald-400" },
    { label: "Pending Reports", value: reports.filter(r => r.status === "Pending").length, color: "from-orange-500 to-amber-400" },
    { label: "Visitor Reports", value: reports.filter(r => r.type === "Visitors").length, color: "from-pink-500 to-rose-400" },
    { label: "Facility Reports", value: reports.filter(r => r.type === "Facilities").length, color: "from-blue-500 to-cyan-400" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md p-2 text-sm"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">Report Type</option>
          <option>Residents</option>
          <option>Visitors</option>
          <option>Facilities</option>
          <option>Maintenance</option>
        </select>
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">Date Range</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <button onClick={handleExport} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm">Export Excel</button>
        <button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Print</button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((c, i) => (
          <div key={i} className={`p-4 rounded-lg text-white shadow hover:shadow-md bg-gradient-to-r ${c.color} transition`}>
            <p className="text-sm opacity-90">{c.label}</p>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-3 text-left">Report Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length ? (
              filteredReports.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition text-gray-700">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.date}</td>
                  <td className={`p-3 font-medium ${r.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>{r.status}</td>
                  <td className="p-3">
                    <button onClick={() => setSelectedReport(r)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative">
            <button onClick={() => setSelectedReport(null)} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-semibold mb-2">{selectedReport.name}</h2>
            <p><strong>Date:</strong> {selectedReport.date}</p>
            <p><strong>Status:</strong> <span className={`font-medium ${selectedReport.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>{selectedReport.status}</span></p>
            <p className="mt-3 text-gray-600">Detailed insights, charts, or analytics can be rendered here using Chart.js or backend data.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Reports);

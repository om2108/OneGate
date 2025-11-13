import React, { useState, useMemo, memo } from "react";

const INITIAL_COMPLAINTS = [
  { title: "Lift Not Working", category: "Maintenance", date: "2025-09-28", status: "Pending", assignedTo: "John", priority: "High" },
  { title: "Broken Gate Lock", category: "Security", date: "2025-09-27", status: "In Progress", assignedTo: "Security Team", priority: "Medium" },
  { title: "Street Light Fault", category: "Maintenance", date: "2025-09-25", status: "Resolved", assignedTo: "Electric Dept.", priority: "Low" },
];

const CATEGORY_OPTIONS = ["All", "Maintenance", "Security", "Other"];
const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Resolved"];
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High"];

const Select = memo(({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded-md px-3 py-1.5 text-sm w-full sm:w-auto"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
));

function Complaint() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [filters, setFilters] = useState({ category: "All", status: "All", priority: "All" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ status: "", assignedTo: "", priority: "" });

  const filteredComplaints = useMemo(
    () => complaints.filter(
      (c) =>
        (filters.category === "All" || c.category === filters.category) &&
        (filters.status === "All" || c.status === filters.status) &&
        (filters.priority === "All" || c.priority === filters.priority)
    ),
    [complaints, filters]
  );

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const openEditModal = (index) => { setEditingIndex(index); setEditData({ ...complaints[index] }); };
  const closeEditModal = () => setEditingIndex(null);
  const saveEdit = () => { setComplaints(prev => prev.map((c,i) => i === editingIndex ? { ...c, ...editData } : c)); closeEditModal(); };
  const deleteComplaint = (index) => { if (window.confirm("Delete this complaint?")) setComplaints(prev => prev.filter((_, i) => i !== index)); };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">🧾 Complaints</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={filters.category} options={CATEGORY_OPTIONS} onChange={v => handleFilterChange("category", v)} />
        <Select value={filters.status} options={STATUS_OPTIONS} onChange={v => handleFilterChange("status", v)} />
        <Select value={filters.priority} options={PRIORITY_OPTIONS} onChange={v => handleFilterChange("priority", v)} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Title", "Category", "Date", "Status", "Assigned To", "Priority", "Actions"].map(h => <th key={h} className="p-3 border-b">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? filteredComplaints.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-3 border-b">{c.title}</td>
                <td className="p-3 border-b">{c.category}</td>
                <td className="p-3 border-b">{c.date}</td>
                <td className="p-3 border-b">{c.status}</td>
                <td className="p-3 border-b">{c.assignedTo}</td>
                <td className="p-3 border-b">{c.priority}</td>
                <td className="p-3 border-b text-center space-x-2">
                  <button onClick={() => openEditModal(i)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">✏️</button>
                  <button onClick={() => deleteComplaint(i)} className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">🗑️</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && closeEditModal()}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Complaint</h3>

            <label className="block text-sm mb-1">Status</label>
            <select value={editData.status} onChange={e => setEditData(prev => ({ ...prev, status: e.target.value }))} className="w-full border rounded-md px-3 py-1.5 mb-3">
              {STATUS_OPTIONS.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
            </select>

            <label className="block text-sm mb-1">Assigned To</label>
            <input type="text" value={editData.assignedTo} onChange={e => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))} className="w-full border rounded-md px-3 py-1.5 mb-3" />

            <label className="block text-sm mb-1">Priority</label>
            <select value={editData.priority} onChange={e => setEditData(prev => ({ ...prev, priority: e.target.value }))} className="w-full border rounded-md px-3 py-1.5 mb-4">
              {PRIORITY_OPTIONS.filter(p => p !== "All").map(p => <option key={p}>{p}</option>)}
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={closeEditModal} className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Complaint);

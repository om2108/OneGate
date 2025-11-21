// src/components/dashboard/secretary/Complaint.jsx
import React, { useState, useMemo, useEffect, memo } from "react";
import {
  getComplaintsBySociety,
  updateComplaintStatus,
  deleteComplaint as deleteComplaintApi,
} from "../../../api/complaint";

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
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
));

function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    priority: "All",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    status: "",
    assignedTo: "",
    priority: "",
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load complaints from API for selected society
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // same key you used in SecretaryHome
        const societyId = localStorage.getItem("secretarySocietyId");
        if (!societyId) {
          setErr("No society selected for complaints.");
          setComplaints([]);
          return;
        }

        const data = await getComplaintsBySociety(societyId);

        const mapped =
          Array.isArray(data) &&
          data.map((c) => ({
            id: c.id || c._id,
            title: c.description || "Complaint",
            category: c.category || "Other",
            date: c.createdAt ? String(c.createdAt).slice(0, 10) : "",
            status: c.status || "Pending",
            // backend: assignedTo is List<String>
            assignedTo: Array.isArray(c.assignedTo)
              ? c.assignedTo.join(", ")
              : c.assignedTo || "",
            priority: c.priority || "Medium",
          }));

        setComplaints(mapped || []);
      } catch (e) {
        console.error("Failed to load complaints", e);
        setErr("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredComplaints = useMemo(
    () =>
      complaints.filter(
        (c) =>
          (filters.category === "All" || c.category === filters.category) &&
          (filters.status === "All" || c.status === filters.status) &&
          (filters.priority === "All" || c.priority === filters.priority)
      ),
    [complaints, filters]
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const openEditModal = (complaint) => {
    setEditingId(complaint.id);
    setEditData({
      status: complaint.status,
      assignedTo: complaint.assignedTo,
      priority: complaint.priority,
    });
  };

  const closeEditModal = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      // Persist only status + priority to backend
      await updateComplaintStatus(editingId, editData.status, editData.priority);

      // Update local state (including assignedTo for UI only)
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...editData } : c
        )
      );
      closeEditModal();
    } catch (e) {
      console.error("Failed to update complaint", e);
      alert("Failed to update complaint. Please try again.");
    }
  };

  const deleteComplaint = async (complaint) => {
    if (!window.confirm("Delete this complaint?")) return;
    if (!complaint.id) {
      // just remove locally if somehow no id
      setComplaints((prev) => prev.filter((c) => c !== complaint));
      return;
    }

    try {
      await deleteComplaintApi(complaint.id);
      setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));
    } catch (e) {
      console.error("Failed to delete complaint", e);
      alert(e?.response?.data || "Failed to delete complaint. Only resolved complaints can be deleted.");
    }
  };

  const editingComplaint = complaints.find((c) => c.id === editingId) || null;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">🧾 Complaints</h2>

      {err && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 mb-2">
          {err}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          value={filters.category}
          options={CATEGORY_OPTIONS}
          onChange={(v) => handleFilterChange("category", v)}
        />
        <Select
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => handleFilterChange("status", v)}
        />
        <Select
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => handleFilterChange("priority", v)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Title",
                "Category",
                "Date",
                "Status",
                "Assigned To",
                "Priority",
                "Actions",
              ].map((h) => (
                <th key={h} className="p-3 border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-500 italic"
                >
                  Loading complaints…
                </td>
              </tr>
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <tr key={c.id || c.title} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{c.title}</td>
                  <td className="p-3 border-b">{c.category}</td>
                  <td className="p-3 border-b">{c.date}</td>
                  <td className="p-3 border-b">{c.status}</td>
                  <td className="p-3 border-b">{c.assignedTo}</td>
                  <td className="p-3 border-b">{c.priority}</td>
                  <td className="p-3 border-b text-center space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteComplaint(c)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-500"
                >
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingComplaint && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && closeEditModal()
          }
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Complaint</h3>

            <label className="block text-sm mb-1">Status</label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full border rounded-md px-3 py-1.5 mb-3"
            >
              {STATUS_OPTIONS.filter((s) => s !== "All").map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <label className="block text-sm mb-1">Assigned To</label>
            <input
              type="text"
              value={editData.assignedTo}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  assignedTo: e.target.value,
                }))
              }
              className="w-full border rounded-md px-3 py-1.5 mb-3"
            />

            <label className="block text-sm mb-1">Priority</label>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="w-full border rounded-md px-3 py-1.5 mb-4"
            >
              {PRIORITY_OPTIONS.filter((p) => p !== "All").map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Complaint);

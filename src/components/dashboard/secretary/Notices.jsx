import React, { useState, memo } from "react";

function Notices() {
  const [notices, setNotices] = useState([
    { title: "Maintenance Payment Due", category: "Maintenance", date: "2025-09-30", validTill: "2025-10-05", desc: "Pay before 5th October 2025." },
    { title: "Diwali Celebration", category: "Event", date: "2025-10-01", validTill: "2025-11-10", desc: "Join us on 10th November." },
    { title: "Water Supply Maintenance", category: "Maintenance", date: "2025-09-28", validTill: "2025-10-02", desc: "No water on 2nd October, 10AM–5PM." },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ title: "", category: "General", date: "", validTill: "", desc: "" });

  const openModal = (notice = null, index = null) => {
    if (notice) {
      setForm(notice);
      setEditIndex(index);
    } else {
      setForm({ title: "", category: "General", date: "", validTill: "", desc: "" });
      setEditIndex(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.title || !form.category || !form.date || !form.validTill || !form.desc) {
      alert("Please fill all fields");
      return;
    }
    setNotices((prev) => {
      const updated = [...prev];
      editIndex !== null ? (updated[editIndex] = form) : updated.push(form);
      return updated;
    });
    closeModal();
  };

  const handleDelete = (i) => {
    if (window.confirm("Delete this notice?")) {
      setNotices((prev) => prev.filter((_, idx) => idx !== i));
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📋 Notices</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => openModal()}>
          + Add Notice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Title", "Category", "Date", "Valid Till", "Actions"].map((head) => (
                <th key={head} className="p-3 border-b">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notices.length ? (
              notices.map((n, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{n.title}</td>
                  <td className="p-3 border-b">{n.category}</td>
                  <td className="p-3 border-b">{n.date}</td>
                  <td className="p-3 border-b">{n.validTill}</td>
                  <td className="p-3 border-b space-x-2">
                    <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => openModal(n, i)}>✏️</button>
                    <button className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200" onClick={() => handleDelete(i)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No notices available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onClick={closeModal}>&times;</button>
            <h3 className="text-xl font-semibold mb-4">{editIndex !== null ? "Edit Notice" : "Add Notice"}</h3>

            <div className="flex flex-col gap-3">
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border rounded px-3 py-2 w-full"/>
              <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2 w-full">
                {["General", "Maintenance", "Emergency", "Event"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="border rounded px-3 py-2 w-full"/>
              <input type="date" name="validTill" value={form.validTill} onChange={handleChange} className="border rounded px-3 py-2 w-full"/>
              <textarea name="desc" rows="3" placeholder="Description" value={form.desc} onChange={handleChange} className="border rounded px-3 py-2 w-full"></textarea>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Notices);

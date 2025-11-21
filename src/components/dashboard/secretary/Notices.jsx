import React, { useState, useEffect, memo } from "react";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../../api/notice"; // adjust path if needed

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "General",
    date: "",
    validTill: "",
    desc: "",
  });

  // ---------- Load notices from API ----------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getNotices();
        setNotices(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load notices", e);
        setErr("Failed to load notices.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openModal = (notice = null, index = null) => {
    if (notice) {
      // Ensure we only pick fields we care about
      setForm({
        title: notice.title || "",
        category: notice.category || "General",
        date: notice.date || "",
        validTill: notice.validTill || "",
        desc: notice.desc || "",
      });
      setEditIndex(index);
    } else {
      setForm({
        title: "",
        category: "General",
        date: "",
        validTill: "",
        desc: "",
      });
      setEditIndex(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Create / Update via API ----------
  const handleSave = async () => {
    if (!form.title || !form.category || !form.date || !form.validTill || !form.desc) {
      alert("Please fill all fields");
      return;
    }

    try {
      let saved;
      if (editIndex !== null) {
        const existing = notices[editIndex];
        const id = existing.id || existing._id;

        if (!id) {
          // fallback: local edit if no id from backend
          const updated = [...notices];
          updated[editIndex] = { ...existing, ...form };
          setNotices(updated);
          closeModal();
          return;
        }

        saved = await updateNotice(id, form);
        setNotices((prev) => {
          const updated = [...prev];
          updated[editIndex] = saved;
          return updated;
        });
      } else {
        saved = await createNotice(form);
        setNotices((prev) => [...prev, saved]);
      }

      closeModal();
    } catch (e) {
      console.error("Failed to save notice", e);
      alert("Failed to save notice. Please try again.");
    }
  };

  // ---------- Delete via API ----------
  const handleDelete = async (i) => {
    if (!window.confirm("Delete this notice?")) return;

    const existing = notices[i];
    const id = existing.id || existing._id;

    try {
      if (id) {
        await deleteNotice(id);
      }
      setNotices((prev) => prev.filter((_, idx) => idx !== i));
    } catch (e) {
      console.error("Failed to delete notice", e);
      alert("Failed to delete notice. Please try again.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📋 Notices</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => openModal()}
        >
          + Add Notice
        </button>
      </div>

      {/* Info / Error */}
      {err && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 mb-2">
          {err}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Title", "Category", "Date", "Valid Till", "Actions"].map(
                (head) => (
                  <th key={head} className="p-3 border-b">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500 italic"
                >
                  Loading notices…
                </td>
              </tr>
            ) : notices.length ? (
              notices.map((n, i) => (
                <tr key={n.id || n._id || i} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{n.title}</td>
                  <td className="p-3 border-b">{n.category}</td>
                  <td className="p-3 border-b">
                    {n.date && n.date.slice(0, 10)}
                  </td>
                  <td className="p-3 border-b">
                    {n.validTill && n.validTill.slice(0, 10)}
                  </td>
                  <td className="p-3 border-b space-x-2">
                    <button
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      onClick={() => openModal(n, i)}
                    >
                      ✏️
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      onClick={() => handleDelete(i)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500"
                >
                  No notices available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && closeModal()
          }
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editIndex !== null ? "Edit Notice" : "Add Notice"}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              >
                {["General", "Maintenance", "Emergency", "Event"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="date"
                name="validTill"
                value={form.validTill}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
              <textarea
                name="desc"
                rows="3"
                placeholder="Description"
                value={form.desc}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleSave}
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

export default memo(Notices);

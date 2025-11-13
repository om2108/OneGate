import React, { memo, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchRequests, deleteAppointment } from "../../../api/appointment";

function Rightbar() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const data = await fetchRequests();
      // ✅ Show only approved appointments
      const approvedAppointments = data.filter((appt) => appt.status === "approved");
      setAppointments(approvedAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <aside className="bg-white shadow-md rounded-lg p-4 w-full sm:w-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Approved Appointments</h3>

      {loading ? (
        <p className="text-gray-500 text-center">Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-bold text-gray-700">{appt.date}</span>
                <span className="text-gray-600">{appt.title}</span>
                <span className="text-gray-500 text-sm">{appt.time}</span>
              </div>
              <button
                onClick={() => handleDelete(appt._id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No approved appointments found</p>
      )}
    </aside>
  );
}

export default memo(Rightbar);

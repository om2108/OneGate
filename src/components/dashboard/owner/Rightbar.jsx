import React, { memo, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchRequests, deleteAppointment } from "../../../api/appointment";
import { getAllProperties } from "../../../api/property";

function Rightbar() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const [apptRes, propRes] = await Promise.all([
        fetchRequests(),
        getAllProperties(),
      ]);

      // only ACCEPTED appointments
      const accepted = apptRes.filter((appt) => appt.status === "ACCEPTED");

      const now = new Date();
      const upcoming = [];
      const expired = [];

      accepted.forEach((a) => {
        if (!a.dateTime) {
          // if no dateTime, treat as upcoming to avoid accidental deletion
          upcoming.push(a);
          return;
        }

        const apptDate = new Date(a.dateTime);

        if (apptDate < now) {
          // appointment date/time already passed -> EXPIRED
          expired.push(a);
        } else {
          upcoming.push(a);
        }
      });

      // OPTIONAL: auto delete expired appointments from DB
      // comment this block if you only want to hide them on UI
      if (expired.length > 0) {
        try {
          await Promise.all(
            expired.map((e) =>
              deleteAppointment(e.id || e._id).catch((err) => {
                console.error("Failed to auto-delete expired appointment:", err);
              })
            )
          );
        } catch (err) {
          console.error("Error while auto-deleting expired appointments:", err);
        }
      }

      // Keep only upcoming (future) accepted appointments in state
      setAppointments(upcoming);
      setProperties(propRes);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyName = (propertyId) => {
    const p = properties.find(
      (x) => x.id === propertyId || x._id === propertyId
    );
    return p?.name || "Unknown Property";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteAppointment(id);
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== id && appt._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete appointment:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const formatTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // sort by date ascending (nearest first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const da = a.dateTime ? new Date(a.dateTime) : new Date(0);
    const db = b.dateTime ? new Date(b.dateTime) : new Date(0);
    return da - db;
  });

  return (
    <aside className="bg-white shadow-md rounded-lg p-4 w-full sm:w-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Approved Appointments
      </h3>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : sortedAppointments.length > 0 ? (
        <ul className="space-y-3">
          {sortedAppointments.map((appt) => {
            const id = appt.id || appt._id;

            return (
              <li
                key={id}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {getPropertyName(appt.propertyId)}
                  </p>

                  <p className="text-gray-600 text-sm">
                    📅 {formatDate(appt.dateTime)}
                  </p>

                  <p className="text-gray-600 text-sm">
                    ⏰ {formatTime(appt.dateTime)}
                  </p>

                  <p className="text-gray-500 text-sm">
                    📍 {appt.location || "No location"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No approved appointments</p>
      )}
    </aside>
  );
}

export default memo(Rightbar);

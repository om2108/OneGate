import React, { memo, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchRequests, deleteAppointment, scoreAppointment } from "../../../api/appointment";
import { getAllProperties } from "../../../api/property";

function NoShowBadge({ score }) {
  if (score == null) return <span className="text-xs text-gray-500">—</span>;
  const pct = Math.round(score * 100);
  const highRisk = score >= 0.7;
  const cls = highRisk ? "text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs" : "text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs";
  return <span className={cls}>{pct}%</span>;
}

function Rightbar() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState({}); // { [id]: boolean }

  const fetchAppointments = async () => {
    try {
      const [apptRes, propRes] = await Promise.all([fetchRequests(), getAllProperties()]);

      const accepted = Array.isArray(apptRes) ? apptRes.filter((appt) => appt.status === "ACCEPTED") : [];

      const now = new Date();
      const upcoming = [];
      const expired = [];

      accepted.forEach((a) => {
        if (!a.dateTime) {
          upcoming.push(a);
          return;
        }
        const apptDate = new Date(a.dateTime);
        if (apptDate < now) expired.push(a);
        else upcoming.push(a);
      });

      // optionally auto-delete expired
      if (expired.length > 0) {
        try {
          await Promise.all(
            expired.map((e) =>
              deleteAppointment(e.id || e._id).catch(() => {})
            )
          );
        } catch {}
      }

      setAppointments(upcoming);
      setProperties(Array.isArray(propRes) ? propRes : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPropertyName = (propertyId) => {
    const p = properties.find((x) => x.id === propertyId || x._id === propertyId);
    return p?.name || "Unknown Property";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id && appt._id !== id));
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Delete failed");
    }
  };

  const handleScore = async (id) => {
    const key = id || "";
    setScoring((s) => ({ ...s, [key]: true }));
    try {
      const updated = await scoreAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => {
          const aid = a.id || a._id;
          if (aid === (updated.id || updated._id)) return updated;
          return a;
        })
      );
    } catch (err) {
      console.error("Scoring failed:", err);
      alert("Failed to score appointment.");
    } finally {
      setScoring((s) => ({ ...s, [key]: false }));
    }
  };

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

  const sortedAppointments = [...appointments].sort((a, b) => {
    const da = a.dateTime ? new Date(a.dateTime) : new Date(0);
    const db = b.dateTime ? new Date(b.dateTime) : new Date(0);
    return da - db;
  });

  return (
    <aside className="bg-white shadow-md rounded-lg p-4 w-full sm:w-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Approved Appointments</h3>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : sortedAppointments.length > 0 ? (
        <ul className="space-y-3">
          {sortedAppointments.map((appt) => {
            const id = appt.id || appt._id;
            const score = appt.noShowScore;
            const last = appt.lastScoredAt;

            return (
              <li key={id} className="flex justify-between items-start bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{getPropertyName(appt.propertyId)}</p>

                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span>📅 {formatDate(appt.dateTime)}</span>
                    <span>⏰ {formatTime(appt.dateTime)}</span>
                  </div>

                  <p className="text-gray-500 text-sm mt-1">📍 {appt.location || "No location"}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">No-show</span>
                      <NoShowBadge score={score} />
                    </div>

                    {last && (
                      <span className="text-xs text-gray-500">scored {new Date(last).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-3">
                  <button
                    onClick={() => handleScore(id)}
                    disabled={!!scoring[id]}
                    className="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {scoring[id] ? "Scoring…" : "Score"}
                  </button>

                  <button onClick={() => handleDelete(id)} className="text-red-500 hover:text-red-700 text-lg">
                    ✕
                  </button>
                </div>
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

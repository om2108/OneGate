// src/components/appointments/TenantRequests.jsx
import React, { useState, useEffect, useContext, memo } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  fetchRequests,
  approveRequest,
  deleteAppointment as rejectRequest,
} from "../../../api/appointment";
import { getAllProperties } from "../../../api/property";
import { getAllUsers } from "../../../api/user"; // <-- use users list to resolve tenant info

function TenantRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]); // from getAllUsers
  const [loading, setLoading] = useState(true);

  // modal state for owner edit
  const [editingReq, setEditingReq] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // 🔹 Load all data
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [reqData, propData, usersData] = await Promise.all([
          fetchRequests(),
          getAllProperties(),
          getAllUsers(),
        ]);
        setRequests(Array.isArray(reqData) ? reqData : []);
        setProperties(Array.isArray(propData) ? propData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ✅ Helpers
  const getPropertyName = (id) => {
    const property = properties.find((p) => p.id === id || p._id === id);
    return property?.name || property?.title || "Unnamed Property";
  };

  const getUserProfileById = (id) => {
    if (!id) return null;
    const profile = users.find(
      (p) => p.id === id || p._id === id || p.userId === id || p._userId === id
    );
    return profile || null;
  };

  // Main helper to get tenant display info (fixes name/email not showing)
  const getTenantDisplay = (req) => {
    // 1) If backend already attached tenant/user object
    const obj =
      req.tenant && typeof req.tenant === "object"
        ? req.tenant
        : req.user && typeof req.user === "object"
        ? req.user
        : null;

    if (obj) {
      return {
        name:
          obj.name || obj.fullName || obj.username || obj.firstName
            ? `${obj.firstName || ""} ${obj.lastName || ""}`.trim()
            : "Unnamed",
        email: obj.email || obj.emailAddress || "No Email",
      };
    }

    // 2) Fallback: use userId / tenantId / requestedBy and match from users list
    const possibleId = req.userId || req.tenantId || req.requestedBy;
    const profile = getUserProfileById(possibleId);

    if (!profile) return { name: "Unknown User", email: "N/A" };

    return {
      name:
        profile.name ||
        profile.fullName ||
        profile.username ||
        (profile.firstName || profile.lastName
          ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
          : "Unnamed"),
      email: profile.email || profile.emailAddress || "No Email",
    };
  };

  // open modal with pre-filled values
  const openApproveModal = (req) => {
    setEditingReq(req);

    if (req.dateTime) {
      const dt = new Date(req.dateTime);
      const iso = dt.toISOString(); // 2025-11-13T05:15:00.000Z
      const dateStr = iso.slice(0, 10); // YYYY-MM-DD
      const timeStr = iso.slice(11, 16); // HH:mm
      setEditDate(dateStr);
      setEditTime(timeStr);
    } else {
      setEditDate("");
      setEditTime("");
    }

    setEditLocation(req.location || "");
  };

  const closeApproveModal = () => {
    setEditingReq(null);
    setEditDate("");
    setEditTime("");
    setEditLocation("");
  };

  // Called when owner confirms approve in modal
  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    if (!editingReq) return;

    let dateTime = null;
    if (editDate && editTime) {
      dateTime = `${editDate}T${editTime}:00`;
    } else if (editDate) {
      dateTime = `${editDate}T09:00:00`; // default time if only date chosen
    }

    const payload = {
      accepted: true,
      dateTime,
      location: editLocation || editingReq.location || "",
    };

    try {
      await approveRequest(editingReq.id || editingReq._id, payload);

      setRequests((prev) =>
        prev.map((r) => {
          const rid = r.id || r._id;
          const eid = editingReq.id || editingReq._id;
          if (rid !== eid) return r;
          return {
            ...r,
            status: "ACCEPTED",
            dateTime: dateTime || r.dateTime,
            location: payload.location,
          };
        })
      );
      closeApproveModal();
    } catch (err) {
      console.error("Error approving:", err);
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      // remove from UI after delete
      setRequests((prev) => prev.filter((r) => (r.id || r._id) !== id));
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("Failed to reject request.");
    }
  };

  // 🌀 Loading & Empty
  if (loading)
    return <div className="p-6 text-gray-600">Loading requests...</div>;
  if (!requests.length)
    return <div className="p-6 text-gray-600">No requests found.</div>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Tenant Appointment Requests
      </h2>

      {/* 🧾 Table for Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            <tr>
              {[
                "Property Name",
                "Tenant Name",
                "Tenant Email",
                "Status",
                "Requested For", // dateTime from tenant
                "Meet Location", // location from tenant
                "Requested At", // createdAt
                "Actions",
              ].map((header) => (
                <th key={header} className="py-3 px-4 text-left border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const tenant = getTenantDisplay(req);
              return (
                <tr
                  key={req.id || req._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    {getPropertyName(req.propertyId)}
                  </td>
                  <td className="py-3 px-4">{tenant.name}</td>
                  <td className="py-3 px-4">{tenant.email}</td>
                  <td className="py-3 px-4">{req.status}</td>

                  {/* Requested visit date/time */}
                  <td className="py-3 px-4">
                    {req.dateTime
                      ? new Date(req.dateTime).toLocaleString()
                      : "N/A"}
                  </td>

                  {/* Requested meet location */}
                  <td className="py-3 px-4">{req.location || "N/A"}</td>

                  {/* When the request was created in system */}
                  <td className="py-3 px-4">
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="py-3 px-4 space-x-2">
                    {req.status === "REQUESTED" ? (
                      <>
                        <button
                          onClick={() => openApproveModal(req)}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id || req._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`font-medium ${
                          req.status === "ACCEPTED"
                            ? "text-green-700"
                            : req.status === "DECLINED"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 Card layout for Mobile */}
      <div className="space-y-4 md:hidden">
        {requests.map((req) => {
          const tenant = getTenantDisplay(req);
          return (
            <div
              key={req.id || req._id}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getPropertyName(req.propertyId)}
              </h3>

              <p className="text-sm text-gray-600">
                <strong>Tenant:</strong> {tenant.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {tenant.email}
              </p>

              {/* Requested visit date/time */}
              <p className="text-sm text-gray-600">
                <strong>Requested For:</strong>{" "}
                {req.dateTime
                  ? new Date(req.dateTime).toLocaleString()
                  : "N/A"}
              </p>

              {/* Requested meet location */}
              <p className="text-sm text-gray-600">
                <strong>Meet Location:</strong> {req.location || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    req.status === "ACCEPTED"
                      ? "text-green-700"
                      : req.status === "DECLINED"
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {req.status}
                </span>
              </p>

              <p className="text-sm text-gray-600 mb-3">
                <strong>Requested At:</strong>{" "}
                {req.createdAt
                  ? new Date(req.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              {req.status === "REQUESTED" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => openApproveModal(req)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-md transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id || req._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div
                  className={`text-center py-2 font-semibold rounded-md ${
                    req.status === "ACCEPTED"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {req.status}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🟢 Approve modal (owner can change date/time/location) */}
      {editingReq && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-900">
                Approve Appointment
              </h3>
              <button
                onClick={closeApproveModal}
                className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmApprove} className="p-4 space-y-4">
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Property:</strong>{" "}
                  {getPropertyName(editingReq.propertyId)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Visit Time
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Meet Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Society gate / Lobby / etc."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeApproveModal}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg border border-green-600 bg-green-600 text-white hover:bg-green-700 text-sm"
                >
                  Confirm & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TenantRequests);

import React, { useState, useEffect, useContext, memo } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  fetchRequests,
  approveRequest,
  rejectRequest,
} from "../../../api/appointment";
import { getAllProperties } from "../../../api/property";
import { getProfile } from "../../../api/profile";

function TenantRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load all data
  useEffect(() => {
    
    const load = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [reqData, propData, profData] = await Promise.all([
          fetchRequests(),
          getAllProperties(),
          getProfile(),
        ]);
        setRequests(Array.isArray(reqData) ? reqData : []);
        setProperties(Array.isArray(propData) ? propData : []);
        setProfiles(Array.isArray(profData) ? profData : []);
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

  const getSocietyName = (id) => {
    const property = properties.find((p) => p.id === id || p._id === id);
    return property?.societyName || "Unknown Society";
  };

  const getUserProfile = (id) => {
    const profile = profiles.find((p) => p.userId === id);
    if (!profile) return { name: "Unknown User", email: "N/A" };
    return {
      name: profile.name || profile.fullName || "Unnamed",
      email: profile.email || "No Email",
    };
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      setRequests((prev) =>
        prev.map((r) =>
          (r.id || r._id) === id ? { ...r, status: "ACCEPTED" } : r
        )
      );
    } catch (err) {
      console.error("Error approving:", err);
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      setRequests((prev) =>
        prev.map((r) =>
          (r.id || r._id) === id ? { ...r, status: "DECLINED" } : r
        )
      );
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
                "Society Name",
                "Tenant Name",
                "Tenant Email",
                "Status",
                "Requested At",
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
              const tenant = getUserProfile(req.userId);
              return (
                <tr
                  key={req.id || req._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{getPropertyName(req.propertyId)}</td>
                  <td className="py-3 px-4">{getSocietyName(req.propertyId)}</td>
                  <td className="py-3 px-4">{tenant.name}</td>
                  <td className="py-3 px-4">{tenant.email}</td>
                  <td className="py-3 px-4">{req.status}</td>
                  <td className="py-3 px-4">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {req.status === "REQUESTED" ? (
                      <>
                        <button
                          onClick={() => handleApprove(req.id || req._id)}
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
          const tenant = getUserProfile(req.userId);
          return (
            <div
              key={req.id || req._id}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getPropertyName(req.propertyId)}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Society:</strong> {getSocietyName(req.propertyId)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tenant:</strong> {tenant.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {tenant.email}
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
                <strong>Requested:</strong>{" "}
                {new Date(req.createdAt).toLocaleString()}
              </p>

              {req.status === "REQUESTED" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(req.id || req._id)}
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
    </div>
  );
}

export default memo(TenantRequests);

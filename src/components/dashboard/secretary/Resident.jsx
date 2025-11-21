// src/components/dashboard/secretary/Resident.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { getMembers } from "../../../api/member";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Resident() {
  // 🔹 Residents loaded from API
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [wing, setWing] = useState("All");
  const [flatType, setFlatType] = useState("All");
  const [ownership, setOwnership] = useState("All");

  // Modal
  const [selectedResident, setSelectedResident] = useState(null);

  // 🔹 Load residents from backend (members by society)
  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoading(true);
        setErr("");

        const societyId = localStorage.getItem("secretarySocietyId");
        if (!societyId) {
          setErr("No society selected. Please select a society in the secretary dashboard.");
          setResidents([]);
          return;
        }

        const data = await getMembers(societyId);
        const list = Array.isArray(data) ? data : [];

        // Map backend member → UI resident shape
        const mapped = list.map((m) => {
          const role = (m.role || "").toUpperCase();
          const ownershipLabel =
            role === "OWNER"
              ? "Owner"
              : role === "TENANT"
              ? "Tenant"
              : "Member";

          return {
            id: m.id || m._id,
            name:
              m.fullName ||
              m.name ||
              m.userName ||
              m.email ||
              "Resident",
            flat:
              m.flat ||
              m.flatNo ||
              m.unit ||
              m.unitNumber ||
              "Flat",
            wing: m.wing || "", // optional, used for filter
            flatType: m.flatType || "", // optional 1BHK/2BHK etc
            ownership: ownershipLabel,
            members: m.familyCount || 1,
            contact: m.phone || m.contact || "",
            email: m.email || "",
            complaints: m.complaintsSummary || "—",
            payment: m.maintenanceStatus || "—",
            bookings: m.bookingSummary || "—",
          };
        });

        setResidents(mapped);
      } catch (e) {
        console.error("Failed to load residents", e);
        setErr("Failed to load residents.");
        setResidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadResidents();
  }, []);

  // Filtered list
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.flat.toLowerCase().includes(search.toLowerCase());

      const matchWing =
        wing === "All" ||
        r.flat.includes(wing) ||
        (r.wing && r.wing.toLowerCase().includes(wing.toLowerCase()));

      const matchOwnership =
        ownership === "All" || r.ownership === ownership;

      const matchFlatType =
        flatType === "All" ||
        (r.flatType && r.flatType.toLowerCase() === flatType.toLowerCase());

      return matchSearch && matchWing && matchOwnership && matchFlatType;
    });
  }, [residents, search, wing, ownership, flatType]);

  // Simple dynamic metrics from loaded residents
  const totalResidents = residents.length;
  const totalFlats = new Set(residents.map((r) => r.flat)).size;
  const ownerCount = residents.filter((r) => r.ownership === "Owner").length;
  const tenantCount = residents.filter((r) => r.ownership === "Tenant").length;

  // Charts (still mostly static – you can wire them to backend later if you want)
  const flatData = {
    labels: ["Owners", "Tenants"],
    datasets: [
      {
        data: [ownerCount, tenantCount],
        backgroundColor: ["#10b981", "#f97316"],
      },
    ],
  };

  const memberData = {
    labels: ["Wing A", "Wing B", "Wing C"],
    datasets: [
      {
        label: "Members per Wing",
        data: [3, 2, 4], // TODO: you can compute real counts per wing from residents
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Residents Overview
      </h1>

      {/* Error / Info */}
      {err && (
        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 mb-2">
          {err}
        </div>
      )}

      {/* 🔍 Top Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name or flat number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-64"
        />
        <select
          value={wing}
          onChange={(e) => setWing(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Wing A</option>
          <option>Wing B</option>
          <option>Wing C</option>
        </select>
        <select
          value={flatType}
          onChange={(e) => setFlatType(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
        </select>
        <select
          value={ownership}
          onChange={(e) => setOwnership(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Owner</option>
          <option>Tenant</option>
          <option>Member</option>
        </select>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Flats (from residents)", value: totalFlats || "—" },
          { label: "Owners", value: ownerCount || "—" },
          { label: "Tenants", value: tenantCount || "—" },
          { label: "Total Residents", value: totalResidents || "—" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{card.label}</p>
            <h3 className="text-xl font-semibold mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* 📈 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Owner vs Tenant</h3>
          <Doughnut
            data={flatData}
            options={{ plugins: { legend: { position: "bottom" } } }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Members per Wing</h3>
          <Bar
            data={memberData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>

      {/* 👥 Resident List */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Resident Directory</h2>

        {loading ? (
          <p className="text-gray-500 text-center py-6 italic">
            Loading residents…
          </p>
        ) : filteredResidents.length > 0 ? (
          filteredResidents.map((r) => (
            <div
              key={r.id || r.email || r.name}
              className="bg-white rounded-lg p-4 shadow flex justify-between items-center mb-3 hover:translate-y-[-2px] transition"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-gray-600">{r.flat}</p>
                <p className="text-xs text-gray-500">
                  {r.ownership} | Members: {r.members}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => setSelectedResident(r)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                >
                  View
                </button>
                {r.contact && (
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    📞
                  </button>
                )}
                {r.email && (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    📧
                  </button>
                )}
                <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                  💬
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">
            No residents found matching your filters.
          </p>
        )}
      </section>

      {/* 🪟 Modal */}
      {selectedResident && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedResident(null)
          }
        >
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              {selectedResident.name}
            </h2>
            <p>
              <strong>Flat:</strong> {selectedResident.flat}
            </p>
            <p>
              <strong>Ownership:</strong> {selectedResident.ownership}
            </p>
            <p>
              <strong>Members:</strong> {selectedResident.members}
            </p>
            <p>
              <strong>Contact:</strong> {selectedResident.contact || "—"}
            </p>
            <p>
              <strong>Email:</strong> {selectedResident.email || "—"}
            </p>
            <p>
              <strong>Complaint History:</strong>{" "}
              {selectedResident.complaints || "—"}
            </p>
            <p>
              <strong>Payment History:</strong>{" "}
              {selectedResident.payment || "—"}
            </p>
            <p>
              <strong>Booking History:</strong>{" "}
              {selectedResident.bookings || "—"}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedResident(null)}
                className="px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

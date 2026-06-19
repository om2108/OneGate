import React, { useEffect, useMemo, useState } from "react";

import {
  FiUsers,
  FiHome,
  FiUserCheck,
  FiSearch,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import { getMembers } from "../../../api/member";

import { getAllProperties } from "../../../api/property";

import { getProfileByUserId } from "../../../api/profile";

import { getAllUsers } from "../../../api/user";

export default function Resident() {
  const [residents, setResidents] = useState([]);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const societyId = localStorage.getItem("secretarySocietyId");

        if (!societyId) return;

        // ✅ API calls
        const membersData = await getMembers(societyId);

        const usersData = await getAllUsers();

        const propertiesData = await getAllProperties();

        const profiles = await Promise.all(
          (membersData || []).map(async (m) => {
            try {
              const res = await getProfileByUserId(m.userId);
              return {
                userId: m.userId,
                ...res,
              };
            } catch {
              return {
                userId: m.userId,
              };
            }
          }),
        );

        // ✅ property map
        const propertyMap = {};

        (propertiesData || []).forEach((p) => {
          propertyMap[p.id || p._id] =
            p.name || p.propertyNumber || "Unnamed Property";
        });

        // ✅ merge users + members
        const formatted = (membersData || []).map((m) => {
          const matchedUser = (usersData || []).find(
            (u) => u.id === m.userId || u._id === m.userId,
          );

          const profile = profiles.find((p) => p.userId === m.userId);

          return {
            id: m.id || m._id,

            name:
              profile?.fullName ||
              matchedUser?.name ||
              matchedUser?.email?.split("@")[0] ||
              "Resident",

            flat: propertyMap[m.propertyId] || "Not Assigned",

            role: matchedUser?.role || m.role || "MEMBER",

            email: matchedUser?.email || "No Email",

            phone:
              profile?.phone ||
              profile?.mobile ||
              matchedUser?.phone ||
              "Not Added",

            joined: m.joinedAt?.slice(0, 10) || "—",
          };
        });

        setResidents(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = useMemo(
    () =>
      residents.filter(
        (r) =>
          r.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.flat?.toLowerCase().includes(search.toLowerCase()),
      ),
    [residents, search],
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8 space-y-8">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Residents</h1>

          <p className="text-gray-500 mt-1">Society resident directory</p>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

          <input
            placeholder="Search resident or property..."
            className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white w-80 outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Residents"
          value={residents.length}
          icon={<FiUsers />}
          color="bg-indigo-500"
        />

        <StatCard
          title="Owners"
          value={residents.filter((r) => r.role === "OWNER").length}
          icon={<FiUserCheck />}
          color="bg-green-500"
        />

        <StatCard
          title="Members"
          value={residents.filter((r) => r.role === "MEMBER").length}
          icon={<FiUsers />}
          color="bg-blue-500"
        />

        <StatCard
          title="Properties"
          value={new Set(residents.map((r) => r.flat)).size}
          icon={<FiHome />}
          color="bg-orange-500"
        />
      </div>

      {/* LIST */}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          Loading residents...
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center text-gray-400">
          No residents found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-slate-800">
                    {r.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{r.flat}</p>
                </div>

                <RoleBadge role={r.role} />
              </div>

              <div className="space-y-2 mt-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail />
                  <span>{r.email || "No email"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone />
                  <span>{r.phone || "No phone"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-xs text-gray-400">
                  Joined: {r.joined || "—"}
                </span>

                <button
                  onClick={() => setSelected(r)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Resident Details
              </h2>

              <RoleBadge role={selected.role} />
            </div>

            <div className="space-y-4">
              <InfoRow label="Name" value={selected.name} />

              <InfoRow label="Property" value={selected.flat} />

              <InfoRow label="Email" value={selected.email || "—"} />

              <InfoRow label="Phone" value={selected.phone || "—"} />

              <InfoRow label="Joined" value={selected.joined || "—"} />
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 transition"
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

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>

        <h2 className="text-3xl font-bold text-slate-800 mt-2">{value}</h2>
      </div>

      <div className={`${color} text-white p-4 rounded-2xl text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    OWNER: "bg-green-100 text-green-700",

    MEMBER: "bg-blue-100 text-blue-700",

    WATCHMAN: "bg-orange-100 text-orange-700",

    SECRETARY: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[role] || "bg-slate-100 text-slate-600"
      }`}
    >
      {role}
    </span>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="bg-slate-50 rounded-2xl px-4 py-3">
    <p className="text-xs text-gray-400">{label}</p>

    <p className="text-sm font-medium text-slate-800 mt-1">{value}</p>
  </div>
);

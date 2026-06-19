// src/components/dashboard/secretary/SecretaryHome.jsx

import React, { useEffect, useMemo, useState } from "react";

import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { useAuth } from "../../../context/AuthContext";

import { getMembers } from "../../../api/member";

import { getComplaintsBySociety } from "../../../api/complaint";

import { getVisitors } from "../../../api/visitor";

import { getAllSocieties } from "../../../api/society";

import { getMaintenance } from "../../../api/maintenance";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const KPI = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-400">{title}</p>

        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>

      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

export default function SecretaryHome() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [societies, setSocieties] = useState([]);

  const [societyId, setSocietyId] = useState(
    localStorage.getItem("secretarySocietyId") || "",
  );

  const [members, setMembers] = useState([]);

  const [complaints, setComplaints] = useState([]);

  const [visitors, setVisitors] = useState([]);

  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    const loadSocieties = async () => {
      try {
        const s = await getAllSocieties();

        setSocieties(s || []);

        // ✅ AUTO SELECT FIRST SOCIETY
        if (!societyId && s?.length) {
          const firstSocietyId = s[0].id || s[0]._id;

          setSocietyId(firstSocietyId);

          // ✅ SAVE
          localStorage.setItem("secretarySocietyId", firstSocietyId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadSocieties();
  }, []);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    if (!societyId) return;

    const loadData = async () => {
      try {
        const m = await getMembers(societyId);

        setMembers(m || []);

        const c = await getComplaintsBySociety(societyId);

        setComplaints(c || []);

        const maint = await getMaintenance(societyId);

        setMaintenance(Array.isArray(maint) ? maint : []);

        const userIds = (m || [])

          .map((x) => x.userId)

          .filter(Boolean);

        const v = await getVisitors(societyId, userIds);

        setVisitors(v || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [societyId]);

  /* =========================
     TODAY COUNTS
  ========================= */

  const today = new Date().toISOString().slice(0, 10);

  const visitorsToday = visitors.filter(
    (v) => v.createdAt?.slice(0, 10) === today,
  ).length;

  const complaintsToday = complaints.filter(
    (c) => c.createdAt?.slice(0, 10) === today,
  ).length;

  /* =========================
   COMPLAINT STATUS
========================= */

  const status = useMemo(() => {
    let resolved = 0;
    let pending = 0;
    let progress = 0;

    complaints.forEach((c) => {
      const s = c?.status?.toUpperCase()?.trim();

      if (s === "RESOLVED") {
        resolved++;
      } else if (s === "IN_PROGRESS" || s === "IN PROGRESS") {
        progress++;
      } else {
        pending++;
      }
    });

    return {
      resolved,
      pending,
      progress,
    };
  }, [complaints]);

  /* =========================
     CHARTS
  ========================= */

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthTotals = new Array(12).fill(0);

  maintenance.forEach((m) => {
    const d = new Date(m.createdAt || Date.now());

    monthTotals[d.getMonth()] += Number(m.amount || m.total || 0);
  });

  const totalMaintenance = maintenance.reduce(
    (a, b) => a + Number(b.amount || 0),

    0,
  );

  const barData = {
    labels: months,

    datasets: [
      {
        label: "Maintenance Collection",

        data: monthTotals,

        backgroundColor: "#4f46e5",

        borderRadius: 12,
      },
    ],
  };

  const pieData = {
    labels: ["Resolved", "Pending", "In Progress"],

    datasets: [
      {
        label: "Complaints",

        data: [status.resolved, status.pending, status.progress],

        backgroundColor: ["#22c55e", "#f97316", "#3b82f6"],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8 space-y-8">
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Secretary Dashboard</h1>

          <p className="text-gray-500 text-sm">Society Management Overview</p>
        </div>

        {isAdmin && (
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={societyId}
            onChange={(e) => {
              setSocietyId(e.target.value);

              localStorage.setItem("secretarySocietyId", e.target.value);
            }}
          >
            {societies.map((s) => (
              <option key={s.id || s._id} value={s.id || s._id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* KPI */}

      <div
        className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-6
gap-6
"
      >
        <KPI title="Residents" value={members.length} icon="👥" />

        <KPI title="Visitors" value={visitorsToday} icon="🚪" />

        <KPI title="Bookings" value="23" icon="🏛️" />

        <KPI title="Complaints" value={complaintsToday} icon="🧾" />

        <KPI title="Total Issues" value={complaints.length} icon="📌" />

        <KPI
          title="Maintenance"
          value={`₹${totalMaintenance.toLocaleString()}`}
          icon="💰"
        />
      </div>

      {/* CHARTS */}

      <div
        className="
grid
lg:grid-cols-2
gap-8
"
      >
        <div
          className="
bg-white
rounded-[30px]
shadow-sm
p-6
min-h-[380px]
"
        >
          <h3
            className="
font-semibold
text-lg
mb-4
"
          >
            Maintenance Collection
          </h3>

          <Bar data={barData} />
        </div>

        <div
          className="
bg-white
rounded-[30px]
shadow-sm
p-6
min-h-[380px]
"
        >
          <h3
            className="
font-semibold
text-lg
mb-4
"
          >
            Complaint Status
          </h3>

          <div
            className="
w-full
h-[250px]
flex
items-center
justify-center
"
          >
            <Doughnut
              data={pieData}
              options={{
                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: "bottom",

                    labels: {
                      boxWidth: 14,

                      padding: 18,
                    },
                  },
                },

                cutout: "68%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

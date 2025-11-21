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
  Title,
  Legend,
} from "chart.js";

import { useAuth } from "../../../context/AuthContext";
import { getMembers } from "../../../api/member";
import { getComplaintsBySociety } from "../../../api/complaint";
import { getVisitors } from "../../../api/visitor";
import { getAllSocieties } from "../../../api/society";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

const KpiCard = ({ icon, label, value, accent }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-start">
    <span className="text-2xl mb-2">{icon}</span>
    <div className="text-gray-500 text-xs sm:text-sm">{label}</div>
    <div className="text-lg sm:text-xl font-semibold mt-1">{value}</div>
  </div>
);

export default function SecretaryHome() {
  const { user } = useAuth();
  const isSecretary = user?.role === "SECRETARY";
  const isAdmin = user?.role === "ADMIN";

  const [societies, setSocieties] = useState([]);
  const [societyId, setSocietyId] = useState(
    () => localStorage.getItem("secretarySocietyId") || ""
  );

  const [members, setMembers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);

  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [err, setErr] = useState("");

  // Helper: date-only key
  const toDateKey = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };
  const todayKey = toDateKey(new Date());

  // 1) Load societies for dropdown / binding
  // For SECRETARY: we will not show dropdown and will clamp to a single society.
  useEffect(() => {
    let cancelled = false;

    const loadSocieties = async () => {
      try {
        setLoadingSocieties(true);
        const data = await getAllSocieties();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setSocieties(list);

        // If no societyId yet, auto-select the first one
        if (!societyId && list.length) {
          const firstId = list[0].id || list[0]._id;
          setSocietyId(firstId);
          localStorage.setItem("secretarySocietyId", firstId);
        }

        // Extra safety: if secretary somehow has a societyId that is not in the list,
        // force it back to the first available society.
        if (isSecretary && societyId) {
          const exists = list.some((s) => (s.id || s._id) === societyId);
          if (!exists && list.length) {
            const firstId = list[0].id || list[0]._id;
            setSocietyId(firstId);
            localStorage.setItem("secretarySocietyId", firstId);
          }
        }
      } catch (e) {
        console.error("Failed to load societies:", e);
        if (!cancelled) setErr("Failed to load societies.");
      } finally {
        if (!cancelled) setLoadingSocieties(false);
      }
    };

    loadSocieties();
    return () => {
      cancelled = true;
    };
  }, [isSecretary]); // depends on role

  // 2) Load members + complaints + visitors whenever societyId changes
  useEffect(() => {
    if (!societyId) return;

    let cancelled = false;
    const loadData = async () => {
      try {
        setErr("");
        setLoadingData(true);

        const membersRes = await getMembers(societyId);
        if (cancelled) return;
        const mList = Array.isArray(membersRes) ? membersRes : [];
        setMembers(mList);

        // complaints for that society
        const complaintsRes = await getComplaintsBySociety(societyId);
        if (!cancelled) {
          setComplaints(Array.isArray(complaintsRes) ? complaintsRes : []);
        }

        // visitors for that society, filtered by member userIds
        const userIds = mList.map((m) => m.userId).filter(Boolean);
        const visitorsRes = await getVisitors(societyId, userIds);
        if (!cancelled) {
          setVisitors(Array.isArray(visitorsRes) ? visitorsRes : []);
        }
      } catch (e) {
        console.error("Failed to load secretary dashboard data:", e);
        if (!cancelled) setErr("Some dashboard data could not be loaded.");
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [societyId]);

  // Derived metrics
  const totalResidents = useMemo(() => members.length, [members]);

  const visitorsToday = useMemo(
    () =>
      visitors.filter((v) => {
        const dateStr = v.time || v.createdAt;
        return toDateKey(dateStr) === todayKey;
      }).length,
    [visitors, todayKey]
  );

  const complaintsToday = useMemo(
    () =>
      complaints.filter((c) => {
        const dateStr = c.createdAt;
        return toDateKey(dateStr) === todayKey;
      }).length,
    [complaints, todayKey]
  );

  const complaintStatus = useMemo(() => {
    const counts = { resolved: 0, pending: 0, inProgress: 0 };

    complaints.forEach((c) => {
      const status = (c.status || "").toLowerCase();
      if (status === "resolved" || status === "closed") counts.resolved += 1;
      else if (status === "in_progress" || status === "in progress")
        counts.inProgress += 1;
      else counts.pending += 1;
    });

    const total =
      counts.resolved + counts.pending + counts.inProgress || 1;

    return {
      counts,
      percentages: {
        resolved: Math.round((counts.resolved / total) * 100),
        pending: Math.round((counts.pending / total) * 100),
        inProgress: Math.round((counts.inProgress / total) * 100),
      },
    };
  }, [complaints]);

  // Temporary static maintenance data
  const monthlyMaintenance = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    amounts: [30000, 40000, 35000, 50000, 45000, 60000],
  };

  const totalMaintenanceCollected = useMemo(
    () =>
      monthlyMaintenance.amounts.reduce(
        (sum, amt) => sum + (Number(amt) || 0),
        0
      ),
    []
  );

  const cards = [
    {
      icon: "📊",
      label: "Total Residents",
      value: totalResidents.toLocaleString("en-IN"),
    },
    {
      icon: "🚪",
      label: "Visitors Today",
      value: visitorsToday.toLocaleString("en-IN"),
    },
    {
      icon: "🏛️",
      label: "Facility Bookings",
      value: "23", // TODO: hook to real API later
    },
    {
      icon: "🧾",
      label: "Complaints Today",
      value: complaintsToday.toLocaleString("en-IN"),
    },
    {
      icon: "💰",
      label: "Maintenance (last 6 mo)",
      value: `₹ ${totalMaintenanceCollected.toLocaleString("en-IN")}`,
    },
  ];

  const barData = {
    labels: monthlyMaintenance.labels,
    datasets: [
      {
        label: "Maintenance Collected (₹)",
        data: monthlyMaintenance.amounts,
        backgroundColor: "rgba(99,102,241,0.85)",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Resolved", "Pending", "In Progress"],
    datasets: [
      {
        label: "Complaint Status",
        data: [
          complaintStatus.counts.resolved,
          complaintStatus.counts.pending,
          complaintStatus.counts.inProgress,
        ],
        backgroundColor: ["#10b981", "#f97316", "#3b82f6"],
        hoverOffset: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Monthly Maintenance Collected" },
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (₹)" },
        ticks: {
          callback: (v) => `₹${v / 1000}k`,
        },
      },
      x: {
        title: { display: true, text: "Month" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Complaint Status Distribution" },
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const value = ctx.parsed || 0;
            const total =
              complaintStatus.counts.resolved +
                complaintStatus.counts.pending +
                complaintStatus.counts.inProgress || 1;
            const pct = Math.round((value / total) * 100);
            return `${label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  const handleSocietyChange = (e) => {
    const id = e.target.value;
    setSocietyId(id);
    localStorage.setItem("secretarySocietyId", id || "");
  };

  const currentSocietyName =
    societies.find((s) => (s.id || s._id) === societyId)?.name || "—";

  // If user is not secretary/admin, simple guard
  if (user && !["SECRETARY", "ADMIN"].includes(user.role)) {
    return (
      <div className="p-4 text-sm text-red-600">
        You do not have permission to view the secretary dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar: society selector (only for ADMIN) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Secretary Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Society: <span className="font-medium">{currentSocietyName}</span>
          </p>
        </div>

        {/* Admin can switch society; secretary is locked to assigned society */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-gray-600">
              Select Society
            </label>
            <select
              value={societyId}
              onChange={handleSocietyChange}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[180px]"
              disabled={loadingSocieties}
            >
              <option value="">-- Choose society --</option>
              {societies.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.name || s.title || s.id || s._id}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Info messages */}
      {err && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs sm:text-sm text-amber-800">
          {err}
        </div>
      )}

      {!societyId && !loadingSocieties && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-xs sm:text-sm text-sky-800">
          No society selected. Please choose a society from the dropdown to view
          secretary stats.
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {cards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm h-80">
          {loadingData ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Loading chart…
            </div>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm h-80">
          {loadingData ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Loading chart…
            </div>
          ) : (
            <Doughnut data={pieData} options={pieOptions} />
          )}
        </div>
      </div>
    </div>
  );
}

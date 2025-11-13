import React from "react";
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
  <div className={`card ${accent} bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col items-start`}>
    <span className="text-2xl mb-2">{icon}</span>
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-xl font-semibold mt-1">{value}</div>
  </div>
);

export default function SecretaryHome() {
  const cards = [
    { icon: "📊", label: "Total Residents", value: "1,248", accent: "accent1" },
    { icon: "🚪", label: "Visitors Today", value: "85", accent: "accent2" },
    { icon: "🏛️", label: "Facility Bookings", value: "23", accent: "accent3" },
    { icon: "🧾", label: "Complaints Today", value: "12", accent: "accent4" },
    { icon: "💰", label: "Maintenance Collected", value: "₹ 3,12,450", accent: "accent5" },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Maintenance Collected (₹)",
        data: [30000, 40000, 35000, 50000, 45000, 60000],
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
        data: [45, 25, 30],
        backgroundColor: ["#10b981", "#f97316", "#3b82f6"],
        hoverOffset: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { title: { display: true, text: "Monthly Maintenance Collected" }, legend: { position: "top" } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount (₹)" }, ticks: { callback: (v) => `₹${v / 1000}k` } },
      x: { title: { display: true, text: "Month" } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Complaint Status Distribution" },
      legend: { position: "bottom" },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <Doughnut data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}

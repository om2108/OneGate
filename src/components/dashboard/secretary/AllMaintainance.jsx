// src/pages/dashboard/secretary/Maintenance.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  IndianRupee,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Bell,
} from "lucide-react";

import { getMaintenance } from "../../../api/maintenance";

import { sendNotification } from "../../../api/notification";

const STATUS = ["ALL", "PAID", "PENDING", "OVERDUE"];

export default function AllMaintainance() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const societyId = localStorage.getItem("secretarySocietyId");

      if (!societyId) {
        setRecords([]);

        return;
      }

      const data = await getMaintenance(societyId, null);

      const formatted = (data || []).map((m) => ({
        id: m.id,

        userId: m.userId,

        resident: m.residentName || "Unknown",

        flat: m.flatNumber || "N/A",

        amount: m.amount || m.totalMaintenanceAmount || 0,

        dueDate: m.dueDate,

        status: m.paymentStatus,

        phone: m.phone || "No Phone",
      }));

      setRecords(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (item) => {
    try {
      await sendNotification(
        item.userId,

        `Maintenance due ₹${item.amount}`,
      );

      alert("Reminder Sent");
    } catch {
      alert("Reminder Failed");
    }
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const s =
        r.resident

          .toLowerCase()

          .includes(search.toLowerCase()) ||
        r.flat

          .toLowerCase()

          .includes(search.toLowerCase());

      const f = filter === "ALL" || r.status === filter;

      return s && f;
    });
  }, [records, search, filter]);

  const total = records

    .filter((x) => x.status === "PAID")

    .reduce(
      (
        a,

        b,
      ) => a + b.amount,

      0,
    );

  const pending = records

    .filter((x) => x.status !== "PAID")

    .reduce(
      (
        a,

        b,
      ) => a + b.amount,

      0,
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black">All Maintenance</h1>

          <p className="text-slate-500">Manage collections</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <Card title="Collected" value={`₹${total}`} color="green" />

        <Card title="Pending" value={`₹${pending}`} color="yellow" />

        <Card
          title="Paid"
          value={records.filter((x) => x.status === "PAID").length}
          color="blue"
        />

        <Card
          title="Overdue"
          value={records.filter((x) => x.status === "OVERDUE").length}
          color="red"
        />
      </div>

      <div className="bg-white rounded-3xl p-5 shadow mb-6 flex gap-4">
        <div className="flex items-center border rounded-2xl px-4 flex-1">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="
w-full
outline-none
p-3
"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
border
rounded-2xl
px-5
"
        >
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-5">Resident</th>

              <th>Flat</th>

              <th>Amount</th>

              <th>Due</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  No Records
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-5">
                    <div>
                      <h2 className="font-bold">{item.resident}</h2>

                      <p className="text-slate-400">{item.phone}</p>
                    </div>
                  </td>

                  <td>{item.flat}</td>

                  <td>₹{item.amount}</td>

                  <td>{item.dueDate}</td>

                  <td>
                    <Badge status={item.status} />
                  </td>

                  <td>
                    {item.status !== "PAID" && (
                      <button
                        onClick={() => sendReminder(item)}
                        className="
bg-black
text-white
px-4
py-2
rounded-xl
flex
items-center
gap-2
"
                      >
                        <Bell size={16} />
                        Reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const styles = {
    green: "from-green-500 to-emerald-500",

    yellow: "from-amber-500 to-orange-500",

    blue: "from-blue-600 to-indigo-600",

    red: "from-red-500 to-rose-500",
  };

  const icons = {
    Collected: "💰",

    Pending: "⏳",

    Paid: "✅",

    Overdue: "⚠️",
  };

  return (
    <div
      className="
bg-white
rounded-[32px]
shadow-sm
hover:shadow-xl
transition
p-6
"
    >
      <div
        className="
flex
justify-between
items-center
"
      >
        <div>
          <p
            className="
text-gray-500
text-sm
"
          >
            {title}
          </p>

          <h2
            className="
text-4xl
font-black
mt-2
"
          >
            {value}
          </h2>
        </div>

        <div
          className="
w-16
h-16
rounded-[24px]
bg-gradient-to-br
from-blue-50
to-indigo-100
flex
items-center
justify-center
text-4xl
shadow-inner
"
        >
          {icons[title]}
        </div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  return (
    <span
      className={`

px-4

py-2

rounded-full

text-xs

${
  status === "PAID"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700"
}

`}
    >
      {status}
    </span>
  );
}

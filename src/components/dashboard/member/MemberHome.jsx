// src/pages/member/home/MemberHome.jsx

import React, { useEffect, useState } from "react";

import { ClipboardList, Users, CalendarDays, Bell } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import { getComplaintsByMember } from "../../../api/complaint";

import { getVisitors } from "../../../api/visitor";

import { getEvents } from "../../../api/event";

import { getNotices } from "../../../api/notice";

import { getMemberByUserId } from "../../../api/member";

export default function MemberHome() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState([]);

  const [visitors, setVisitors] = useState([]);

  const [events, setEvents] = useState([]);

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (user?.id) {
      load();
    }
  }, [user]);

  const load = async () => {
    try {
      setLoading(true);

      const member = await getMemberByUserId(user.id);

      const [c, v, e, n] = await Promise.allSettled([
        getComplaintsByMember(user.id),

        getVisitors(member.societyId, [user.id]),

        getEvents(member.societyId, [user.role]),

        getNotices(),
      ]);

      setComplaints(c.value || []);

      setVisitors(v.value || []);

      setEvents(e.value || []);

      setNotices(n.value || []);
    } finally {
      setLoading(false);
    }
  };

  const active = complaints.filter(
    (x) => !["RESOLVED", "Closed"].includes(x.status),
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <div className="bg-white rounded-3xl px-8 py-6 shadow-sm">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Member Dashboard</h1>

        <p className="text-slate-500 mt-2">Welcome back 👋</p>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          title="Complaints"
          value={active}
          color="bg-slate-900"
          icon={<ClipboardList />}
        />

        <StatCard
          title="Visitors"
          value={visitors.length}
          color="bg-blue-600"
          icon={<Users />}
        />

        <StatCard
          title="Events"
          value={events.length}
          color="bg-green-600"
          icon={<CalendarDays />}
        />

        <StatCard
          title="Notices"
          value={notices.length}
          color="bg-yellow-500"
          icon={<Bell />}
        />
      </div>

      {/* SIDE BY SIDE */}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="My Complaints" count={complaints.length}>
          {complaints.length ? (
            complaints.map((item) => (
              <Row
                key={item.id}
                title={item.title}
                desc={`Priority: ${item.priority || "Normal"}`}
                status={item.status}
              />
            ))
          ) : (
            <Empty text="No complaints" />
          )}
        </Card>

        <Card title="Latest Notices" count={notices.length}>
          {notices.length ? (
            notices

              .slice(0, 10)

              .map((item) => (
                <Row key={item.id} title={item.title} desc={item.description} />
              ))
          ) : (
            <Empty text="No notices" />
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      className={`${color}
rounded-3xl
p-6
text-white
shadow-sm`}
    >
      <div className="flex justify-between">
        <div>
          <p>{title}</p>

          <h1 className="text-4xl font-bold mt-3">{value}</h1>
        </div>

        <div className="bg-white/20 p-3 rounded-2xl">{icon}</div>
      </div>
    </div>
  );
}

function Card({ title, count, children }) {
  return (
    <div
      className="
bg-white
rounded-3xl
shadow-sm
border
p-6
h-[650px]
flex
flex-col
"
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <span
          className="
bg-slate-100
rounded-xl
px-4
py-2
"
        >
          {count}
        </span>
      </div>

      <div
        className="
space-y-4
overflow-y-auto
flex-1
"
      >
        {children}
      </div>
    </div>
  );
}

function Row({ title, desc, status }) {
  return (
    <div
      className="
border
rounded-2xl
p-5
hover:shadow-sm
"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>

          <p className="text-slate-500 mt-2">{desc}</p>
        </div>

        {status && (
          <div
            className={`

px-4

py-2

rounded-full

text-xs

font-semibold

${
  status === "RESOLVED"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700"
}

`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div
      className="
bg-slate-50
rounded-3xl
text-center
py-20
text-slate-400
"
    >
      {text}
    </div>
  );
}

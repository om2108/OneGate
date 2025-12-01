import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed

import { getComplaintsByMember } from "../../../api/complaint";
import { getVisitors } from "../../../api/visitor";
import { getEvents } from "../../../api/event";
import { getNotices } from "../../../api/notice"; // adjust if your file is notices.js
import societyApi from "../../../api/society";

export default function MemberHome() {
  const { user } = useAuth() ?? {};
  const userId = user?.id;
  const societyId = user?.societyId;

  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState(null);
  const [trend, setTrend] = useState(null);
  const [activeComplaints, setActiveComplaints] = useState(0);
  const [visitorsThisMonth, setVisitorsThisMonth] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let mounted = true;
    async function load() {
      try {
        // complaints by member
        const complaints = await getComplaintsByMember(userId);
        if (mounted) {
          const active = Array.isArray(complaints)
            ? complaints.filter((c) => !["Resolved", "Closed"].includes(c.status)).length
            : 0;
          setActiveComplaints(active);
        }

        // visitors by society (pass societyId + optional userIds array)
        if (societyId) {
          const visitors = await getVisitors(societyId, [userId]);
          if (mounted) setVisitorsThisMonth(Array.isArray(visitors) ? visitors.length : 0);
        }

        // all events
        const events = await getEvents();
        if (mounted) {
          const arr = Array.isArray(events) ? events : [];
          // simple upcoming split: events with a future date OR joinable flag
          const now = new Date();
          const up = arr.filter((e) => {
            if (e.joinable) return true;
            if (!e.date) return true;
            const d = new Date(e.date);
            return d >= now;
          });
          setUpcomingEvents(up.length);
        }

        // notices
        const n = await getNotices();
        if (mounted) setNotices(Array.isArray(n) ? n.slice(0, 6) : []);

        // maintenance summary
        if (societyId) {
          const { summary, permissionDenied } = await societyApi.getMaintenanceForUser(societyId);
          if (mounted) {
            if (!permissionDenied) {
              setStats({
                maintenanceDue: summary?.due ?? 0,
                maintenancePaid: summary?.paid ?? 0,
                invoicesCount: summary?.invoicesCount ?? 0,
              });
              if (summary?.trend) setTrend(summary.trend);
            } else {
              setStats({ maintenanceDue: 0, maintenancePaid: 0, invoicesCount: 0 });
            }
          }
        }
      } catch (err) {
        console.error("MemberHome.load:", err);
      }
    }

    load();
    return () => { mounted = false; };
  }, [userId, societyId]);

  const s = useMemo(
    () => ({
      maintenanceDue: stats?.maintenanceDue ?? 2500,
      activeComplaints: activeComplaints ?? 0,
      visitorsThisMonth: visitorsThisMonth ?? 0,
      upcomingEvents: upcomingEvents ?? 0,
    }),
    [stats, activeComplaints, visitorsThisMonth, upcomingEvents]
  );

  // reuse your original MemberHome markup (trimmed for brevity here)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Good Morning, Member</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back — here's your society overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm text-slate-500">Profile</span>
            <span className="text-sm font-medium text-slate-900">You</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1 1 18.879 6.196 9 9 0 0 1 5.12 17.804z" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 0-6 0" />
            </svg>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Maintenance Due</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">₹{s.maintenanceDue}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Active Complaints</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{s.activeComplaints}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Visitors This Month</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{s.visitorsThisMonth}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">Upcoming Events</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{s.upcomingEvents}</div>
        </div>
      </section>

      {/* Trend chart, quick actions, notices and activity: reuse your original markup and feed `notices` and `trend` */}
    </div>
  );
}

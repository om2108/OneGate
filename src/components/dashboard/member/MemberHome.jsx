// src/components/member/MemberHome.jsx
import React, { memo, useEffect, useState, useContext } from "react";
import StatCard from "./StatCard"; // optional: if you split StatCard earlier; else inline below
import DuesList, { duesData } from "./DuesList"; // existing component you added
import FacilitiesBooking from "./FacilitiesBooking";
import MaintenanceCard from "./MaintenanceCard";
import { getAllSocieties } from "../../../api/society";
import { AuthContext } from "../../../context/AuthContext";

/* If you don't have StatCard as a separate file, use the small inline one below */
const InlineStatCard = ({ title, value, subtitle }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
    <div className="text-xs text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    {subtitle && <div className="mt-1 text-xs text-gray-400">{subtitle}</div>}
  </div>
);

const QuickAction = ({ title, onClick }) => (
  <button onClick={onClick} className="rounded-lg py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium">
    {title}
  </button>
);

const MemberHome = memo(function MemberHome() {
  const { user } = useContext(AuthContext);
  const [societyId, setSocietyId] = useState(user?.societyId || "");
  const [loadingSoc, setLoadingSoc] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user?.societyId) {
        setSocietyId(user.societyId);
        return;
      }
      // fallback: fetch first society if user has no societyId
      try {
        setLoadingSoc(true);
        const list = await getAllSocieties();
        if (!mounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setSocietyId(list[0].id || list[0]._id);
        }
      } catch (e) {
        console.warn("Failed to load societies:", e);
      } finally {
        if (mounted) setLoadingSoc(false);
      }
    })();
    return () => (mounted = false);
  }, [user]);

  const onPayHandler = (maintenance) => {
    // implement your payment flow or redirect to payment provider
    alert(`Payment flow for ₹${Math.round(maintenance.totalMaintenanceAmount)} (not implemented)`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InlineStatCard title="Pending Dues" value="₹1,250" subtitle="Due by 10 Nov" />
        <InlineStatCard title="Open Complaints" value="2" subtitle="Active" />
        <InlineStatCard title="Upcoming Notices" value="1" subtitle="General meeting" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <MaintenanceCard societyId={societyId} userId={user?.id || user?._id} onPay={onPayHandler} />
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Notices</h3>
              <QuickAction title="View all" onClick={() => alert("Open notices")} />
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="py-2 border-b last:border-b-0">Annual general meeting on 20 Nov</li>
              <li className="py-2 border-b last:border-b-0">Water supply maintenance on 14 Nov</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <QuickAction title="New complaint" onClick={() => alert("Compose complaint")} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <QuickAction title="Pay Dues" onClick={() => alert("Pay")} />
              <QuickAction title="Raise Complaint" onClick={() => alert("Complaint")} />
              <QuickAction title="Book Facility" onClick={() => alert("Book")} />
              <QuickAction title="Contact Secretary" onClick={() => alert("Contact")} />
            </div>
          </div>

          {/* Facilities booking component (loads facilities from API) */}
          <FacilitiesBooking societyId={societyId} />
        </div>
      </div>

      {/* optional dues list component */}
      <div>
        <DuesList dues={duesData} loading={false} onPay={(due) => alert(`Paying ${due.id}`)} />
      </div>
    </div>
  );
});

export default MemberHome;

// src/components/member/MaintenanceCard.jsx
import React, { useEffect, useState } from "react";
import { getMaintenanceForUser } from "../../../api/society";

export default function MaintenanceCard({ societyId, userId, onPay }) {
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!societyId || !userId) {
        setErr("Missing society or user");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setErr("");
        const res = await getMaintenanceForUser(societyId, userId);
        if (!mounted) return;
        setMaintenance(res);
      } catch (e) {
        console.error("Failed to fetch maintenance:", e);
        setErr("Could not load maintenance.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [societyId, userId]);

  if (loading) return <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">Loading maintenance…</div>;
  if (err) return <div className="p-4 rounded-xl bg-white shadow-sm border border-rose-100 text-rose-700">{err}</div>;
  if (!maintenance) return <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">No maintenance data</div>;

  const amount = maintenance.totalMaintenanceAmount ?? 0;
  const dueDate = maintenance.dueDate ? new Date(maintenance.dueDate).toLocaleDateString() : "—";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Maintenance Due</h3>
          <p className="text-xs text-gray-500">Next due date</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{Math.round(amount).toLocaleString("en-IN")}</div>
          <div className="text-xs text-gray-400">Due: {dueDate}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            // delegate actual payment to parent if provided
            if (onPay) return onPay(maintenance);
            alert(`Pay ₹${Math.round(amount)} — (payment flow not implemented)`);
          }}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          Pay Now
        </button>

        <button
          onClick={() => alert("Download / view invoice — not implemented")}
          className="px-3 py-2 border rounded-md text-sm"
        >
          View Invoice
        </button>
      </div>
    </div>
  );
}

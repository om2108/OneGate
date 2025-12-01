// src/components/member/FacilitiesBooking.jsx
import React, { useEffect, useState } from "react";
import { getFacilitiesBySociety, bookFacility } from "../../../api/society";

export default function FacilitiesBooking({ societyId }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityId, setFacilityId] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!societyId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const list = await getFacilitiesBySociety(societyId);
        if (!mounted) return;
        setFacilities(Array.isArray(list) ? list : []);
        setFacilityId((Array.isArray(list) && list[0]?.id) || (Array.isArray(list) && list[0]?._id) || "");
      } catch (e) {
        console.error("Failed to load facilities:", e);
        setMessage("Could not load facilities.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [societyId]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!facilityId) return setMessage("Select a facility");
    if (!date) return setMessage("Select a date");
    try {
      setBooking(true);
      // payload shape — adapt to your server
      const payload = { date, notes: "Booked from web UI", durationHours: 2 };
      // If backend endpoint not present, this will fail — handle gracefully
      await bookFacility(facilityId, payload);
      setMessage(`Booked successfully for ${date}`);
    } catch (err) {
      console.error("Booking failed:", err);
      setMessage("Booking failed (server may not have endpoint).");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Book Facility</h3>
        <div className="text-xs text-gray-400">Manage bookings</div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading facilities…</div>
      ) : facilities.length === 0 ? (
        <div className="text-sm text-gray-500">No facilities configured for this society.</div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Facility</label>
            <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200">
              {facilities.map((f) => (
                <option key={f.id || f._id} value={f.id || f._id}>
                  {f.name} {f.usageChargePerHour ? `• ₹${f.usageChargePerHour}/hr` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={booking} className={`rounded-lg py-2 px-3 text-sm ${booking ? "bg-blue-50 text-blue-600" : "bg-blue-600 text-white"}`}>
              {booking ? "Booking…" : "Book"}
            </button>
            <div className="text-sm text-gray-500">{message}</div>
          </div>
        </form>
      )}
    </div>
  );
}

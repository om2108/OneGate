import React, { useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

/**
 * Very small booking UI (local state). Replace handlers with API calls.
 */
export default function FacilitiesBooking({ available = ["Club House", "Gym", "Badminton Court"] }) {
  const [facility, setFacility] = useState(available[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!date) return setMessage("Select a date");
    setMessage(`Booked ${facility} on ${date} (simulated)`);
    // call API here...
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Book Facility</h3>
        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">Facility</label>
          <select value={facility} onChange={(e) => setFacility(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200">
            {available.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="rounded-lg py-2 px-3 bg-blue-600 text-white text-sm">Book</button>
          <div className="text-sm text-gray-500">{message}</div>
        </div>
      </form>
    </div>
  );
}

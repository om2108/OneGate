import React, { useEffect, useState } from "react";

import { getVisitorLogs } from "../../../api/visitor";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");

  const societyId = localStorage.getItem("secretarySocietyId");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getVisitorLogs(societyId);

      setLogs(res);
    } catch {
      alert("Failed loading logs");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Visitor",

      "Flat",

      "Type",

      "Status",

      "CheckIn",

      "CheckOut",
    ];

    const rows = logs.map((l) => [
      l.visitorName,

      l.flatNumber,

      l.visitorType,

      l.status,

      l.checkIn,

      l.checkOut,
    ]);

    let csv = headers.join(",") + "\n";

    rows.forEach((r) => {
      csv += r.join(",") + "\n";
    });

    const blob = new Blob(
      [csv],

      {
        type: "text/csv",
      },
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "visitor_logs.csv";

    a.click();
  };

  const filtered = status ? logs.filter((l) => l.status === status) : logs;

  return (
    <div
      className="
min-h-screen
bg-slate-100
p-6
"
    >
      <div
        className="
max-w-7xl
mx-auto
"
      >
        <div
          className="
bg-white
rounded-3xl
p-6
mb-6
"
        >
          <div
            className="
flex
justify-between
"
          >
            <div>
              <h1
                className="
text-3xl
font-bold
"
              >
                Visitor Logs
              </h1>

              <p
                className="
text-gray-500
"
              >
                Secretary & Watchman Records
              </p>
            </div>

            <button
              onClick={exportCSV}
              className="
bg-blue-600
text-white
px-5
rounded-xl
"
            >
              Export CSV
            </button>
          </div>

          <div
            className="
mt-5
"
          >
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
border
rounded-xl
p-3
"
            >
              <option value="">All</option>

              <option>PENDING</option>

              <option>APPROVED</option>

              <option>REJECTED</option>

              <option>CHECKED_OUT</option>
            </select>
          </div>
        </div>

        <div
          className="
bg-white
rounded-3xl
overflow-hidden
"
        >
          {loading ? (
            <div
              className="
p-10
"
            >
              Loading...
            </div>
          ) : (
            <table
              className="
w-full
"
            >
              <thead>
                <tr
                  className="
bg-slate-50
"
                >
                  <th
                    className="
p-4
"
                  >
                    Visitor
                  </th>

                  <th>Flat</th>

                  <th>Type</th>

                  <th>Status</th>

                  <th>Check In</th>

                  <th>Check Out</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="
border-t
"
                  >
                    <td
                      className="
p-4
"
                    >
                      {l.visitorName}
                    </td>

                    <td>{l.flatNumber}</td>

                    <td>{l.visitorType}</td>

                    <td>{l.status}</td>

                    <td>
                      {l.checkIn ? new Date(l.checkIn).toLocaleString() : "-"}
                    </td>

                    <td>
                      {l.checkOut ? new Date(l.checkOut).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

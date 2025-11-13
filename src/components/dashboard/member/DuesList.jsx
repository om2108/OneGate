import React, { memo, useMemo, useCallback, useState } from "react";

/* ---------------------- SAMPLE JSON DATA ---------------------- */
export const duesData = [
  {
    id: 1,
    amount: 1250,
    dueDate: "2025-11-10",
    status: "Unpaid",
    note: "Monthly Maintenance for November"
  },
  {
    id: 2,
    amount: 500,
    dueDate: "2025-08-10",
    status: "Paid",
    note: "Water Bill (August)"
  },
  {
    id: 3,
    amount: 750,
    dueDate: "2025-12-01",
    status: "Unpaid",
    note: "Parking Charges"
  }
];

/* ---------------------- UTIL: FORMAT CURRENCY ---------------------- */
const formatAmount = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

/* ---------------------- SKELETON LOADER ---------------------- */
const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-6 w-1/3 bg-gray-200 rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

/* ---------------------- MAIN COMPONENT ---------------------- */
function DuesListInner({ dues = [], loading = false, onPay }) {
  const [btnLoading, setBtnLoading] = useState({});

  // Memoized total dues
  const totalDue = useMemo(
    () => dues.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [dues]
  );

  // Handle Pay action (optional)
  const handlePay = useCallback(
    async (due) => {
      if (!onPay) return;
      if (btnLoading[due.id]) return;

      try {
        setBtnLoading((prev) => ({ ...prev, [due.id]: true }));
        await onPay(due); // Parent will handle
      } finally {
        setBtnLoading((prev) => ({ ...prev, [due.id]: false }));
      }
    },
    [onPay, btnLoading]
  );

  if (loading) return <Skeleton />;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">My Dues</h3>
          <p className="text-xs text-gray-500">Society Maintenance & Monthly Bills</p>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">
            Total: <span className="font-semibold">{formatAmount(totalDue)}</span>
          </div>
          <div className="text-xs text-gray-400">as of {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* NO DUES */}
      {dues.length === 0 ? (
        <div className="text-sm text-gray-500">🎉 No dues pending</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {dues.map((d) => {
            const isPaid = d.status?.toLowerCase() === "paid";
            const loadingPay = btnLoading[d.id];

            return (
              <li
                key={d.id}
                className="p-3 rounded-lg border border-gray-100 bg-white flex flex-col justify-between gap-3"
              >
                
                {/* Amount + Due date */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {formatAmount(d.amount)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      Due: {new Date(d.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {d.note && (
                    <div className="text-xs text-gray-500 truncate">{d.note}</div>
                  )}
                </div>

                {/* Status & Button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      isPaid
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>

                  {!isPaid && (
                    <button
                      onClick={() => handlePay(d)}
                      disabled={loadingPay}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition focus:ring-2 focus:ring-blue-200 ${
                        loadingPay
                          ? "bg-blue-50 text-blue-600 cursor-wait"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {loadingPay ? "Processing..." : "Pay"}
                    </button>
                  )}
                </div>

              </li>
            );
          })}

        </ul>
      )}
    </section>
  );
}

const DuesList = memo(DuesListInner);

export default DuesList;

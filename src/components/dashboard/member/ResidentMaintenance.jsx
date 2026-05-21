import React, { useEffect, useMemo, useState } from "react";

import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import {
  getMaintenance,
  createOrder,
  verifyPayment,
} from "../../../api/maintenance";

import { useAuth } from "../../../context/AuthContext";

export default function ResidentMaintenance() {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getMaintenance(user?.societyId);

      const mine = (data || [])

        .filter((x) => x.userId === (user?.id || user?._id))

        .map((x) => {
          const due = new Date(x.dueDate);

          const now = new Date();

          return {
            ...x,

            year: due.getFullYear(),

            month: due.toLocaleString("default", {
              month: "long",
            }),

            autoStatus:
              x.paymentStatus === "PAID"
                ? "PAID"
                : due < now
                  ? "OVERDUE"
                  : "PENDING",
          };
        });

      setRecords(mine);
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((x) => x.year === year);

  const paid = filtered.filter((x) => x.autoStatus === "PAID");

  const pending = filtered.filter((x) => x.autoStatus !== "PAID");

  const future = filtered.filter((x) => new Date(x.dueDate) > new Date());

  const total = filtered.reduce(
    (a, b) => a + (b.totalMaintenanceAmount || 0),

    0,
  );

  const pay = async (item) => {
    try {
      const order = await createOrder(item.id);

      new window.Razorpay({
        key: order.key,

        amount: order.amount * 100,

        currency: "INR",

        order_id: order.orderId,

        name: "Maintenance",

        handler: async (r) => {
          await verifyPayment(
            item.id,

            {
              paymentId: r.razorpay_payment_id,

              signature: r.razorpay_signature,
            },
          );

          load();
        },
      }).open();
    } catch {
      alert("Payment Failed");
    }
  };

  return (
    <div
      className="
p-6
bg-slate-100
min-h-screen
"
    >
      <div
        className="
flex
justify-between
mb-6
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
"
          >
            Maintenance
          </h1>

          <p
            className="
text-gray-500
"
          >
            Yearly history
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="
rounded-xl
border
px-4
py-2
"
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div
        className="
grid
md:grid-cols-4
gap-4
mb-8
"
      >
        <Card title="Total" value={`₹${total}`} />

        <Card title="Paid" value={paid.length} />

        <Card title="Pending" value={pending.length} />

        <Card title="Upcoming" value={future.length} />
      </div>

      <div
        className="
space-y-4
"
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="
bg-white
rounded-3xl
shadow
p-6
flex
justify-between
"
            >
              <div>
                <h2
                  className="
font-bold
"
                >
                  {item.month}
                </h2>

                <div>₹{item.totalMaintenanceAmount}</div>

                <div>
                  Due:
                  {item.dueDate}
                </div>
              </div>

              <div>
                {item.autoStatus === "PAID" ? (
                  <div
                    className="
text-green-600
"
                  >
                    <CheckCircle />
                    PAID
                  </div>
                ) : (
                  <>
                    <div
                      className="
text-red-600
mb-3
"
                    >
                      {item.autoStatus}
                    </div>

                    <button
                      onClick={() => pay(item)}
                      className="
bg-black
text-white
px-5
py-2
rounded-xl
"
                    >
                      <CreditCard />
                      Pay
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      className="
bg-white
rounded-3xl
shadow
p-5
"
    >
      <div
        className="
text-gray-500
"
      >
        {title}
      </div>

      <div
        className="
text-3xl
font-bold
"
      >
        {value}
      </div>
    </div>
  );
}

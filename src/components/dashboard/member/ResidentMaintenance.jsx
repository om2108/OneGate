// ============================================
// ResidentMaintenance.jsx
// ============================================

import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarDays,
  Home,
  Receipt,
  BadgeIndianRupee,
} from "lucide-react";

import {
  getMaintenance,
  createOrder,
  verifyPayment,
} from "../../../api/maintenance";

import {
  getMemberByUserId
} from "../../../api/member";

import { useAuth }
from "../../../context/AuthContext";

import { jwtDecode }
from "jwt-decode";

export default function ResidentMaintenance() {

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [records, setRecords] =
    useState([]);

  const [member, setMember] =
    useState(null);

  const [payingId, setPayingId] =
    useState("");

  useEffect(() => {

    if(user?.token){

      loadMaintenance();

    }

  }, [user]);

  const loadMaintenance = async () => {

    try {

      setLoading(true);

      // =====================================
      // GET USER ID
      // =====================================

      const decoded =
        jwtDecode(user.token);

      const userId =
        decoded.id;

      console.log(
        "USER ID:",
        userId
      );

      // =====================================
      // GET MEMBER
      // =====================================

      const memberData =
        await getMemberByUserId(
          userId
        );

      console.log(
        "MEMBER:",
        memberData
      );

      setMember(memberData);

      const societyId =
        memberData?.societyId;

      console.log(
        "SOCIETY ID:",
        societyId
      );

      // =====================================
      // GET MAINTENANCE
      // =====================================

      const data =
        await getMaintenance(
          societyId,
          userId
        );

      console.log(
        "MAINTENANCE:",
        data
      );

      setRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "LOAD MAINTENANCE ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // TOTAL
  // =====================================

  const totalAmount = useMemo(() => {

    return records.reduce(

      (a, b) =>

        a + Number(
          b.amount || 0
        ),

      0
    );

  }, [records]);

  // =====================================
  // PAID
  // =====================================

  const paidAmount = useMemo(() => {

    return records

      .filter(
        (x) =>
          x.paymentStatus === "PAID"
      )

      .reduce(

        (a, b) =>

          a + Number(
            b.amount || 0
          ),

        0
      );

  }, [records]);

  // =====================================
  // PENDING
  // =====================================

  const pendingAmount =
    totalAmount - paidAmount;

  const pendingBills =
    records.filter(
      (x) =>
        x.paymentStatus !== "PAID"
    ).length;

  // =====================================
  // PAYMENT
  // =====================================

  const handlePayment = async (
    item
  ) => {

    try {

      setPayingId(item.id);

      const order =
        await createOrder(item.id);

      const options = {

        key: order.key,

        amount: order.amount,

        currency: order.currency,

        name: "Society Maintenance",

        description:
          `Maintenance Payment - ${item.flatNumber}`,

        order_id: order.orderId,

        handler: async (
          response
        ) => {

          await verifyPayment(
            item.id,
            {
              paymentId:
                response.razorpay_payment_id,

              signature:
                response.razorpay_signature,
            }
          );

          await loadMaintenance();

          alert(
            "Payment Successful"
          );
        },

        prefill: {
          name:
            item.residentName,
        },

        theme: {
          color: "#0f172a",
        },
      };

      const razor =
        new window.Razorpay(
          options
        );

      razor.open();

    } catch (err) {

      console.error(err);

      alert("Payment Failed");

    } finally {

      setPayingId("");
    }
  };

  if (loading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          My Maintenance
        </h1>

        <p className="text-slate-500 mt-1">
          Manage and pay your society maintenance
        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-5">

        <StatCard
          title="Total Amount"
          value={`₹${totalAmount}`}
          icon={<Wallet size={22} />}
          color="bg-slate-900"
        />

        <StatCard
          title="Paid"
          value={`₹${paidAmount}`}
          icon={<CheckCircle2 size={22} />}
          color="bg-green-600"
        />

        <StatCard
          title="Pending"
          value={`₹${pendingAmount}`}
          icon={<Clock3 size={22} />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Bills"
          value={pendingBills}
          icon={<Receipt size={22} />}
          color="bg-red-500"
        />

      </div>

      {/* CONTENT */}

      <div className="space-y-5">

        {records.length === 0 ? (

          <div className="bg-white rounded-3xl p-20 text-center text-slate-400 shadow-sm">

            No maintenance found

          </div>

        ) : (

          records.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
            >

              <div className="flex flex-col lg:flex-row justify-between gap-6">

                {/* LEFT */}

                <div className="flex-1 space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center">

                      <Home size={24} />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-slate-800">

                        {item.flatNumber}

                      </h2>

                      <p className="text-slate-500">

                        {item.residentName}

                      </p>

                    </div>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4">

                    <InfoCard
                      icon={<BadgeIndianRupee size={18} />}
                      label="Amount"
                      value={`₹${item.amount}`}
                    />

                    <InfoCard
                      icon={<CalendarDays size={18} />}
                      label="Due Date"
                      value={item.dueDate}
                    />

                    <InfoCard
                      icon={
                        item.paymentStatus === "PAID"
                          ? <CheckCircle2 size={18} />
                          : <AlertTriangle size={18} />
                      }
                      label="Status"
                      value={item.paymentStatus}
                    />

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col justify-center items-start lg:items-end gap-4">

                  <div
                    className={`
                      px-5
                      py-2
                      rounded-full
                      text-sm
                      font-semibold

                      ${
                        item.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >

                    {item.paymentStatus}

                  </div>

                  {item.paymentStatus !== "PAID" && (

                    <button
                      onClick={() => handlePayment(item)}
                      disabled={payingId === item.id}
                      className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition"
                    >

                      <CreditCard size={18} />

                      {
                        payingId === item.id
                          ? "Processing..."
                          : "Pay Now"
                      }

                    </button>

                  )}

                </div>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  title,
  value,
  icon,
  color
}) {

  return (

    <div className={`${color} rounded-3xl p-5 text-white shadow-sm`}>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm opacity-90">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="bg-white/20 p-3 rounded-2xl">

          {icon}

        </div>

      </div>

    </div>
  );
}

// ============================================
// INFO CARD
// ============================================

function InfoCard({
  icon,
  label,
  value
}) {

  return (

    <div className="border rounded-2xl p-4 bg-slate-50">

      <div className="flex items-center gap-2 text-slate-500 text-sm">

        {icon}

        {label}

      </div>

      <h3 className="font-semibold text-slate-800 mt-2">

        {value}

      </h3>

    </div>
  );
}
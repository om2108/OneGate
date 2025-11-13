import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PaymentsChart() {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Mock JSON Data (you can replace this later with API data)
  const mockData = [
    { month: "Jan", amount: 4500 },
    { month: "Feb", amount: 5200 },
    { month: "Mar", amount: 4800 },
    { month: "Apr", amount: 6100 },
    { month: "May", amount: 5600 },
    { month: "Jun", amount: 6300 },
    { month: "Jul", amount: 5900 },
    { month: "Aug", amount: 6800 },
    { month: "Sep", amount: 7200 },
    { month: "Oct", amount: 7500 },
    { month: "Nov", amount: 7000 },
    { month: "Dec", amount: 8000 },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPaymentData(mockData);
      setLoading(false);
    }, 800); // Simulate delay
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        Loading chart...
      </div>
    );

  if (!paymentData.length)
    return (
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        No payment data available.
      </div>
    );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow w-full h-72 sm:h-80">
      <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
        Monthly Payments Overview
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={paymentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              fontSize: "0.85rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

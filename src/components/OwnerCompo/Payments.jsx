import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../../style/Ownercss/Payments.css";

const data = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 7000 },
  { month: "Mar", amount: 6000 },
  { month: "Apr", amount: 8000 },
  { month: "May", amount: 9000 },
  { month: "Jun", amount: 7500 },
  { month: "Jul", amount: 9500 },
];

export default function Payments() {
  return (
    <section className="payments">
      <h3>Total Payments Received</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4CAF50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

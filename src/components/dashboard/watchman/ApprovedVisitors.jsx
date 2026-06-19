import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ArrowLeft, CheckCircle, LogIn, LogOut, Clock } from "lucide-react";

import {
  getVisitors,
  checkInVisitor,
  checkOutVisitor,
} from "../../../api/visitor";

const VisitorCard = ({
  item,

  onCheckIn,

  onCheckOut,
}) => (
  <div
    className="
bg-white
rounded-3xl
border
p-5
shadow-sm
space-y-4
"
  >
    {item.imageUrl && (
      <img
        src={item.imageUrl}
        className="
w-full
h-56
rounded-2xl
object-cover
"
      />
    )}

    <div
      className="
flex
justify-between
"
    >
      <div>
        <h2
          className="
text-xl
font-bold
"
        >
          {item.visitorName}
        </h2>

        <p
          className="
text-sm
text-gray-500
"
        >
          Flat:
          {item.flatNumber}
        </p>

        <p
          className="
text-sm
text-gray-500
"
        >
          Purpose:
          {item.purpose}
        </p>
      </div>

      <span
        className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
h-fit
"
      >
        {item.status}
      </span>
    </div>

    <div
      className="
flex
gap-3
"
    >
      {!item.checkIn && (
        <button
          onClick={() => onCheckIn(item.id)}
          className="
flex-1
bg-blue-600
text-white
rounded-xl
py-3
flex
justify-center
items-center
gap-2
"
        >
          <LogIn size={18} />
          Check In
        </button>
      )}

      {item.checkIn && !item.checkOut && (
        <button
          onClick={() => onCheckOut(item.id)}
          className="
flex-1
bg-red-600
text-white
rounded-xl
py-3
flex
justify-center
items-center
gap-2
"
        >
          <LogOut size={18} />
          Check Out
        </button>
      )}
    </div>

    {item.checkIn && (
      <div
        className="
text-sm
text-gray-500
flex
items-center
gap-2
"
      >
        <Clock size={16} />
        IN:
        {new Date(item.checkIn).toLocaleString()}
      </div>
    )}

    {item.checkOut && (
      <div
        className="
text-sm
text-gray-500
flex
items-center
gap-2
"
      >
        <Clock size={16} />
        OUT:
        {new Date(item.checkOut).toLocaleString()}
      </div>
    )}
  </div>
);

export default function ApprovedVisitors() {
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);

  const [loading, setLoading] = useState(true);

  const societyId = localStorage.getItem("secretarySocietyId");

  const load = async () => {
    try {
      setLoading(true);

      const data = await getVisitors(societyId);

      setVisitors(data.filter((v) => v.status === "APPROVED"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const checkIn = async (id) => {
    await checkInVisitor(id);

    load();
  };

  const checkOut = async (id) => {
    await checkOutVisitor(id);

    load();
  };

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
max-w-6xl
mx-auto
"
      >
        <div
          className="
flex
items-center
gap-4
mb-8
"
        >
          <button
            onClick={() => navigate("/dashboard/watchman/image-verification")}
          >
            <ArrowLeft />
          </button>

          <div>
            <h1
              className="
text-3xl
font-bold
"
            >
              Approved Visitors
            </h1>

            <p
              className="
text-gray-500
"
            >
              Visitors inside premises
            </p>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            className="
grid
lg:grid-cols-2
gap-6
"
          >
            {visitors.length ? (
              visitors.map((v) => (
                <VisitorCard
                  key={v.id}
                  item={v}
                  onCheckIn={checkIn}
                  onCheckOut={checkOut}
                />
              ))
            ) : (
              <div
                className="
bg-white
rounded-3xl
p-10
text-center
"
              >
                No approved visitors
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

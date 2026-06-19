import React, { useEffect, useMemo, useState } from "react";

import { Search, Eye, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

import { getVisitors, updateVisitorStatus } from "../../../api/visitor";

import { sendNotification } from "../../../api/notification";

import { useAuth } from "../../../context/AuthContext";

export default function ResidentVisitors() {
  const { user } = useAuth();

  const societyId = user?.societyId;

  const userId = user?.id;

  const [visitors, setVisitors] = useState([]);

  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const t = setInterval(load, 7000);

    return () => clearInterval(t);
  }, []);

  const load = async () => {
    try {
      const data = await getVisitors(societyId);

      setVisitors((data || []).filter((v) => v.residentId === userId));
    } finally {
      setLoading(false);
    }
  };

  const approve = async (visitor) => {
    if (!visitor.imageVerified) {
      alert("Secretary verification pending");

      return;
    }

    await updateVisitorStatus(
      visitor.id,

      "APPROVED",
    );

    await sendNotification(
      visitor.createdById,

      `Visitor ${visitor.visitorName}
approved`,
    );

    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitor.id
          ? {
              ...v,
              status: "APPROVED",
            }
          : v,
      ),
    );
  };

  const reject = async (visitor) => {
    await updateVisitorStatus(
      visitor.id,

      "REJECTED",
    );

    await sendNotification(
      visitor.createdById,

      `Visitor ${visitor.visitorName}
rejected`,
    );

    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitor.id
          ? {
              ...v,
              status: "REJECTED",
            }
          : v,
      ),
    );
  };

  const filtered = useMemo(() => {
    return visitors.filter((v) =>
      (v.visitorName || "")

        .toLowerCase()

        .includes(search.toLowerCase()),
    );
  }, [visitors, search]);

  return (
    <div
      className="
min-h-screen
bg-slate-100
p-8
"
    >
      <div
        className="
flex
justify-between
mb-8
"
      >
        <div>
          <h1
            className="
text-4xl
font-bold
"
          >
            Resident Visitors
          </h1>

          <p>Verify visitor requests</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="
Search
"
          className="
bg-white
rounded-xl
px-5
py-3
"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
"
        >
          {filtered.map((v) => (
            <div
              key={v.id}
              className="
bg-white
rounded-[32px]
overflow-hidden
shadow
"
            >
              <img
                src={v.imageUrl}
                className="
w-full
h-[250px]
object-cover
"
              />

              <div
                className="
p-5
space-y-4
"
              >
                <div
                  className="
flex
justify-between
"
                >
                  <h2
                    className="
text-xl
font-bold
"
                  >
                    {v.visitorName}
                  </h2>

                  <span
                    className="
bg-slate-100
rounded-full
px-3
"
                  >
                    {v.status}
                  </span>
                </div>

                <p>
                  Flat:
                  {v.flatNumber}
                </p>

                <p>
                  Purpose:
                  {v.purpose}
                </p>

                <div>
                  {v.imageVerified ? (
                    <div
                      className="
bg-green-100
text-green-700
rounded-xl
p-3
"
                    >
                      Secretary Verified
                    </div>
                  ) : (
                    <div
                      className="
bg-yellow-100
text-yellow-700
rounded-xl
p-3
"
                    >
                      Waiting Verification
                    </div>
                  )}
                </div>

                {v.status === "WAITING_RESIDENT" && v.imageVerified && (
                  <div
                    className="
grid
grid-cols-2
gap-3
"
                  >
                    <button
                      onClick={() => approve(v)}
                      className="
bg-green-600
text-white
rounded-xl
py-3
"
                    >
                      <CheckCircle />
                      Approve
                    </button>

                    <button
                      onClick={() => reject(v)}
                      className="
bg-red-600
text-white
rounded-xl
py-3
"
                    >
                      <XCircle />
                      Reject
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSelected(v)}
                  className="
w-full
border
rounded-xl
py-3
"
                >
                  <Eye />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="
fixed
inset-0
bg-black/50
grid
place-items-center
"
        >
          <div
            className="
bg-white
rounded-3xl
overflow-hidden
max-w-lg
w-full
"
          >
            <img
              src={selected.imageUrl}
              className="
w-full
h-[350px]
object-cover
"
            />

            <div
              className="
p-6
"
            >
              <button
                onClick={() => setSelected(null)}
                className="
w-full
bg-black
text-white
rounded-xl
py-4
"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

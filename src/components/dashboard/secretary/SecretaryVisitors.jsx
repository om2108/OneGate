import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  CheckCircle,
  XCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { getVisitors, updateVisitorStatus } from "../../../api/visitor";

import { sendNotification } from "../../../api/notification";

export default function SecretaryVisitors() {
  const societyId = localStorage.getItem("secretarySocietyId");

  const [visitors, setVisitors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getVisitors(societyId);

      setVisitors(data || []);
    } finally {
      setLoading(false);
    }
  };

  const verify = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              imageVerified: true,
            }
          : v,
      ),
    );
  };

  const approve = async (visitor) => {
    if (!visitor.imageVerified) {
      alert("Verify image first");

      return;
    }

    await updateVisitorStatus(
      visitor.id,

      visitor.residentId ? "FORWARD" : "APPROVED",
    );

    if (visitor.createdById) {
      await sendNotification(
        visitor.createdById,

        `${visitor.visitorName} approved`,
      );
    } else {
      await sendNotification(
        visitor.createdById,

        `${visitor.visitorName}
approved`,
      );
    }

    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitor.id
          ? {
              ...v,

              status: visitor.residentId ? "WAITING_RESIDENT" : "APPROVED",
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

    if (visitor.createdById) {
      await sendNotification(
        visitor.createdById,

        `${visitor.visitorName} rejected`,
      );
    }
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
  }, [search, visitors]);

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
            Secretary Verification
          </h1>

          <p>Verify visitor image</p>
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
xl:grid-cols-2
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
h-[320px]
object-cover
"
              />

              <div
                className="
p-6
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
text-2xl
font-bold
"
                  >
                    {v.visitorName}
                  </h2>

                  <span
                    className="
bg-slate-100
px-3
rounded-full
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

                <div
                  className="
flex
gap-2
"
                >
                  <span
                    className={
                      v.imageVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {v.imageVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                {v.status === "PENDING" && (
                  <>
                    {!v.imageVerified && (
                      <button
                        onClick={() => verify(v.id)}
                        className="
w-full
bg-blue-600
text-white
rounded-xl
py-4
"
                      >
                        <ShieldCheck />
                        Verify Image
                      </button>
                    )}

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
py-4
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
py-4
"
                      >
                        <XCircle />
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

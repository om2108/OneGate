// src/components/dashboard/owner/TenantAgreementList.jsx

import React, { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FileText,
  CheckCircle,
  Building,
  Calendar,
  Eye,
  ShieldCheck,
} from "lucide-react";

export default function TenantAgreementList() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);

  const mockTenants = [
    {
      id: 1,
      name: "Amit Sharma",
      property: "Sunrise Apartment 102",
      rent: "₹15,000",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      approved: false,
    },

    {
      id: 2,
      name: "Priya Patel",
      property: "GreenVille Villa 8B",
      rent: "₹25,000",
      leaseStart: "2024-03-15",
      leaseEnd: "2025-03-14",
      approved: false,
    },

    {
      id: 3,
      name: "Rahul Mehta",
      property: "Silver Heights 5A",
      rent: "₹18,500",
      leaseStart: "2024-05-01",
      leaseEnd: "2025-04-30",
      approved: false,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setTenants(mockTenants);

      setLoading(false);
    }, 700);
  }, []);

  const approve = (id) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              approved: true,
            }
          : t,
      ),
    );
  };

  const approved = useMemo(
    () => tenants.filter((t) => t.approved).length,

    [tenants],
  );

  if (loading) {
    return (
      <div
        className="
min-h-screen
p-8
bg-gradient-to-br
from-slate-50
via-blue-50
to-white
"
      >
        <div
          className="
grid
md:grid-cols-3
gap-6
"
        >
          {Array.from({
            length: 3,
          }).map((_, i) => (
            <div
              key={i}
              className="
h-72
rounded-3xl
bg-white
animate-pulse
"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gradient-to-br
from-slate-50
via-blue-50
to-white
p-6
"
    >
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
mb-8
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
text-gray-900
"
          >
            Tenant Agreements
          </h1>

          <p
            className="
text-gray-500
"
          >
            Review and approve agreements
          </p>
        </div>
      </div>

      {/* STATS */}

      <div
        className="
grid
md:grid-cols-3
gap-5
mb-8
"
      >
        <Card title="Total" value={tenants.length} icon={<FileText />} />

        <Card title="Approved" value={approved} icon={<ShieldCheck />} />

        <Card
          title="Pending"
          value={tenants.length - approved}
          icon={<Calendar />}
        />
      </div>

      {/* GRID */}

      <div
        className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
"
      >
        {tenants.map((t) => (
          <motion.div
            key={t.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            whileHover={{
              y: -4,
            }}
            className="
bg-white
rounded-[32px]
shadow-sm
hover:shadow-xl
transition
overflow-hidden
"
          >
            <div
              className="
bg-gradient-to-r
from-blue-600
to-indigo-600
p-5
text-white
"
            >
              <div
                className="
flex
justify-between
"
              >
                <h3
                  className="
font-semibold
text-lg
"
                >
                  {t.name}
                </h3>

                {t.approved && <CheckCircle />}
              </div>
            </div>

            <div
              className="
p-6
space-y-4
"
            >
              <div
                className="
flex
gap-3
"
              >
                <Building size={18} />

                <span>{t.property}</span>
              </div>

              <div>
                <p
                  className="
text-sm
text-gray-500
"
                >
                  Rent
                </p>

                <p
                  className="
font-semibold
"
                >
                  {t.rent}
                </p>
              </div>

              <div>
                <p
                  className="
text-sm
text-gray-500
"
                >
                  Lease
                </p>

                <p>
                  {t.leaseStart}—{t.leaseEnd}
                </p>
              </div>

              <div
                className="
flex
gap-3
pt-3
"
              >
                <button
                  onClick={() => setSelected(t)}
                  className="
flex-1
rounded-2xl
border
py-3
flex
justify-center
gap-2
"
                >
                  <Eye size={18} />
                  View
                </button>

                <button
                  disabled={t.approved}
                  onClick={() => approve(t.id)}
                  className="

flex-1

rounded-2xl

text-white

bg-gradient-to-r

from-blue-600

to-indigo-600

py-3

disabled:bg-gray-400

"
                >
                  {t.approved ? "Approved" : "Approve"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {selected && (
          <div
            className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
grid
place-items-center
z-50
p-4
"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
bg-white
w-full
max-w-lg
rounded-[32px]
overflow-hidden
"
            >
              <div
                className="
bg-gradient-to-r
from-blue-600
to-indigo-600
p-6
text-white
"
              >
                <h2
                  className="
text-2xl
font-bold
"
                >
                  Agreement Details
                </h2>
              </div>

              <div
                className="
p-6
space-y-4
"
              >
                <Row title="Tenant" value={selected.name} />

                <Row title="Property" value={selected.property} />

                <Row title="Rent" value={selected.rent} />

                <Row
                  title="Lease"
                  value={`${selected.leaseStart}
→
${selected.leaseEnd}`}
                />

                <div
                  className="
pt-5
flex
justify-end
"
                >
                  <button
                    onClick={() => setSelected(null)}
                    className="
px-6
py-3
rounded-2xl
bg-blue-600
text-white
"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div
      className="
bg-white
rounded-[30px]
shadow-sm
p-6
"
    >
      <div
        className="
flex
justify-between
"
      >
        <div>
          <p
            className="
text-gray-500
"
          >
            {title}
          </p>

          <h2
            className="
text-4xl
font-bold
"
          >
            {value}
          </h2>
        </div>

        {icon}
      </div>
    </div>
  );
}

function Row({ title, value }) {
  return (
    <div>
      <p
        className="
text-sm
text-gray-500
"
      >
        {title}
      </p>

      <p
        className="
font-semibold
"
      >
        {value}
      </p>
    </div>
  );
}

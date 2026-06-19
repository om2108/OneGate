// src/components/users/AddUserModal.jsx

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { inviteUser } from "../../../api/user";

import { getAllProperties } from "../../../api/property";

import { Mail, UserPlus, Building2, X, Loader2 } from "lucide-react";

const NEED_PROPERTY = ["SECRETARY", "MEMBER", "WATCHMAN"];

export default function AddUserModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("USER");

  const [propertyId, setPropertyId] = useState("");

  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await getAllProperties();

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async () => {
    if (!email.trim()) {
      return alert("Enter email");
    }

    if (NEED_PROPERTY.includes(role) && !propertyId) {
      return alert("Select Property");
    }

    try {
      setLoading(true);

      await inviteUser({
        email,
        role,

        propertyId: NEED_PROPERTY.includes(role) ? propertyId : null,
      });

      onSuccess?.();

      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
fixed
inset-0
bg-black/50
backdrop-blur-sm
z-50
grid
place-items-center
p-4
"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="
w-full
max-w-xl
overflow-hidden
rounded-[32px]
bg-white
shadow-[0_20px_60px_rgba(0,0,0,.15)]
"
      >
        {/* HEADER */}

        <div
          className="
bg-gradient-to-r
from-blue-600
to-indigo-600
text-white
p-6
"
        >
          <div
            className="
flex
justify-between
items-center
"
          >
            <div>
              <h2
                className="
text-2xl
font-bold
"
              >
                Invite User
              </h2>

              <p
                className="
text-blue-100
mt-1
"
              >
                Add member to dashboard
              </p>
            </div>

            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        {/* BODY */}

        <div
          className="
p-6
space-y-5
"
        >
          {/* EMAIL */}

          <div>
            <label
              className="
text-sm
font-medium
text-gray-600
mb-2
block
"
            >
              Email
            </label>

            <div
              className="
relative
"
            >
              <Mail
                size={18}
                className="
absolute
left-4
top-4
text-gray-400
"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="
Enter user email
"
                className="
w-full
pl-11
pr-4
py-3
rounded-2xl
border
focus:ring-2
focus:ring-blue-500
outline-none
"
              />
            </div>
          </div>

          {/* ROLE */}

          <div>
            <label
              className="
text-sm
font-medium
text-gray-600
mb-2
block
"
            >
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
w-full
p-3
rounded-2xl
border
"
            >
              <option value="USER">User</option>

              <option value="SECRETARY">Secretary</option>

              <option value="MEMBER">Member</option>

              <option value="WATCHMAN">Watchman</option>
            </select>
          </div>

          {/* PROPERTY */}

          {NEED_PROPERTY.includes(role) && (
            <div>
              <label
                className="
text-sm
font-medium
text-gray-600
mb-2
block
"
              >
                Property
              </label>

              <div
                className="
relative
"
              >
                <Building2
                  size={18}
                  className="
absolute
left-4
top-4
text-gray-400
"
                />

                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="
w-full
pl-11
pr-4
py-3
rounded-2xl
border
"
                >
                  <option value="">Select Property</option>

                  {properties.map((p) => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      {p.propertyNumber ||
                        p.flatNumber ||
                        p.name ||
                        p.title ||
                        "Unnamed Property"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* FOOTER */}

          <div
            className="
flex
justify-end
gap-3
pt-3
"
          >
            <button
              onClick={onClose}
              className="
px-5
py-3
rounded-2xl
bg-gray-100
hover:bg-gray-200
"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={submit}
              className="
px-6
py-3
rounded-2xl
bg-gradient-to-r
from-blue-600
to-indigo-600
text-white
flex
items-center
gap-2
disabled:opacity-60
"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="
animate-spin
"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Invite
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

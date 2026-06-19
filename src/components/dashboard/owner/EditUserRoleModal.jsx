// src/components/users/EditUserRoleModal.jsx

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { updateUserRole } from "../../../api/user";

import { getAllProperties } from "../../../api/property";

import { Shield, Building2, Loader2, X } from "lucide-react";

const ROLES = ["USER", "SECRETARY", "MEMBER", "WATCHMAN"];

const NEED_PROPERTY = ["SECRETARY", "MEMBER", "WATCHMAN"];

export default function EditUserRoleModal({ user, onClose, onSuccess }) {
  const [role, setRole] = useState(user?.role || "USER");

  const [propertyId, setPropertyId] = useState(
    user?.propertyId || user?.property?.id || user?.property?._id || "",
  );

  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllProperties();

        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const submit = async () => {
    if (NEED_PROPERTY.includes(role) && !propertyId) {
      return alert("Select Property");
    }

    try {
      setLoading(true);

      await updateUserRole(
        user.id || user._id,

        {
          role,

          propertyId: NEED_PROPERTY.includes(role) ? propertyId : null,
        },
      );

      onSuccess?.();

      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Update failed");
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
grid
place-items-center
z-50
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
        className="
bg-white
w-full
max-w-xl
rounded-[34px]
overflow-hidden
shadow-[0_20px_80px_rgba(0,0,0,.15)]
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
"
          >
            <div>
              <h2
                className="
text-2xl
font-bold
"
              >
                Update User Role
              </h2>

              <p
                className="
text-blue-100
mt-1
"
              >
                Manage user permissions
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
          <div>
            <label
              className="
text-sm
text-gray-500
"
            >
              Email
            </label>

            <div
              className="
mt-2
rounded-2xl
bg-slate-50
p-4
font-medium
"
            >
              {user.email}
            </div>
          </div>

          <div>
            <label
              className="
text-sm
text-gray-500
mb-2
block
"
            >
              Role
            </label>

            <div
              className="
relative
"
            >
              <Shield
                size={18}
                className="
absolute
left-4
top-4
text-gray-400
"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="
w-full
pl-11
pr-4
py-3
rounded-2xl
border
"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {NEED_PROPERTY.includes(role) && (
            <div>
              <label
                className="
text-sm
text-gray-500
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
                        p.title ||
                        p.name ||
                        "Unnamed Property"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div
            className="
flex
justify-end
gap-3
pt-4
"
          >
            <button
              onClick={onClose}
              className="
px-6
py-3
rounded-2xl
bg-slate-100
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
                  Updating
                </>
              ) : (
                "Update Role"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// src/components/users/UsersList.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  Shield,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import {
  getAllUsers,
  deleteUser,
} from "../../../api/user";

import EditUserRoleModal from "./EditUserRoleModal";

import AddUserModal from "./AddUserModal";

import { motion } from "framer-motion";

export default function UsersList() {

  const [users, setUsers] =
    useState([]);

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [showAddModal,
    setShowAddModal] =
    useState(false);

  const loadUsers =
    async () => {

      try {

        setLoading(true);

        const data =
          await getAllUsers();

        setUsers(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadUsers();

  }, []);

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete user?"
        )
      )
        return;

      try {

        await deleteUser(id);

        loadUsers();

      } catch {

        alert(
          "Delete failed"
        );

      }

    };

  const filtered =
    useMemo(() => {

      return users.filter(
        (u) =>
          (
            u.name || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          (
            u.email || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [users, search]);

  return (

    <div className="
min-h-screen
bg-gradient-to-br
from-slate-50
via-blue-50
to-white
p-6
">

      {/* HEADER */}

      <div className="
flex
flex-col
sm:flex-row
justify-between
gap-4
mb-6
">

        <div>

          <h1 className="
text-3xl
font-bold
">
            Users
          </h1>

          <p className="
text-gray-500
">
            Manage all users
          </p>

        </div>

        <div className="
flex
gap-3
">

          <button

            onClick={
              loadUsers
            }

            className="
px-5
py-3
rounded-2xl
bg-white
border
shadow-sm
flex
items-center
gap-2
hover:bg-gray-50
transition
"

          >

            <RefreshCw
              size={18}
            />

            Refresh

          </button>

          <button

            onClick={() =>
              setShowAddModal(
                true
              )
            }

            className="
px-5
py-3
rounded-2xl
bg-gradient-to-r
from-blue-600
to-indigo-600
text-white
flex
items-center
gap-2
shadow-lg
hover:scale-[1.02]
transition
"

          >

            <UserPlus
              size={18}
            />

            Invite User

          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="
grid
md:grid-cols-3
gap-4
mb-6
">

        <Card
          icon={<Users />}
          title="Total"
          value={
            users.length
          }
        />

        <Card
          icon={<Shield />}
          title="Verified"
          value={
            users.filter(
              (
                u
              ) =>
                u.verified
            ).length
          }
        />

        <Card
          icon={<Users />}
          title="Pending"
          value={
            users.filter(
              (
                u
              ) =>
                !u.verified
            ).length
          }
        />

      </div>

      {/* SEARCH */}

      <div className="
relative
mb-5
">

        <Search
          size={18}
          className="
absolute
left-4
top-3.5
text-gray-400
"
        />

        <input

          value={
            search
          }

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          placeholder="
Search users...
"

          className="
w-full
pl-12
p-3
rounded-2xl
border
bg-white
shadow-sm
"

        />

      </div>

      {/* TABLE */}

      <div className="
rounded-[32px]
bg-white
shadow-sm
overflow-hidden
">

        {loading ? (

          <div className="
p-10
text-center
text-gray-500
">
            Loading...
          </div>

        ) : (

          <div className="
overflow-x-auto
">

            <table className="
w-full
">

              <thead>

                <tr className="
bg-slate-100
">

                  {[
                    "User",
                    "Role",
                    "Property",
                    "Status",
                    "Actions",
                  ].map(
                    (
                      item
                    ) => (

                      <th

                        key={
                          item
                        }

                        className="
p-4
text-left
font-semibold
text-gray-700
"

                      >

                        {item}

                      </th>

                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (
                    user
                  ) => (

                    <motion.tr

                      key={
                        user.id ||
                        user._id
                      }

                      initial={{
                        opacity: 0,
                      }}

                      animate={{
                        opacity: 1,
                      }}

                      className="
border-b
hover:bg-blue-50
transition
"

                    >

                      {/* USER */}

                      <td className="
p-4
">

                        <div className="
font-semibold
text-gray-800
">
                          {
                            user.name ||
                            "No Name"
                          }
                        </div>

                        <div className="
text-sm
text-gray-500
">
                          {
                            user.email
                          }
                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="
capitalize
p-4
font-medium
">

                        {
                          user.role
                        }

                      </td>

                      {/* PROPERTY */}

                      <td className="
p-4
text-gray-600
">

                        {
                          user.propertyName ||
                          "Not Assigned"
                        }

                      </td>

                      {/* STATUS */}

                      <td className="
p-4
">

                        <span
                          className={`

px-3
py-1
rounded-full
text-sm
font-medium

${

user.verified

?

"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}
                        >

                          {

                            user.verified

                              ?

                              "Verified"

                              :

                              "Pending"

                          }

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="
p-4
">

                        <div className="
flex
gap-5
">

                          <button

                            onClick={() =>
                              setSelectedUser(
                                user
                              )
                            }

                            className="
text-blue-600
hover:scale-110
transition
"

                          >

                            <Pencil
                              size={19}
                            />

                          </button>

                          <button

                            onClick={() =>
                              handleDelete(
                                user.id ||
                                  user._id
                              )
                            }

                            className="
text-red-500
hover:scale-110
transition
"

                          >

                            <Trash2
                              size={19}
                            />

                          </button>

                        </div>

                      </td>

                    </motion.tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* EDIT MODAL */}

      {selectedUser && (

        <EditUserRoleModal

          user={
            selectedUser
          }

          onClose={() =>
            setSelectedUser(
              null
            )
          }

          onSuccess={
            loadUsers
          }

        />

      )}

      {/* ADD USER MODAL */}

      {showAddModal && (

        <AddUserModal

          onClose={() =>
            setShowAddModal(
              false
            )
          }

          onSuccess={() => {

            loadUsers();

            setShowAddModal(
              false
            );

          }}

        />

      )}

    </div>

  );

}

function Card({
  icon,
  title,
  value,
}) {

  return (

    <div className="
bg-white
rounded-[30px]
shadow-sm
p-5
">

      <div className="
flex
justify-between
items-center
">

        <div>

          <p className="
text-gray-500
">
            {title}
          </p>

          <h2 className="
text-3xl
font-bold
">
            {value}
          </h2>

        </div>

        <div className="
text-blue-600
">

          {icon}

        </div>

      </div>

    </div>

  );

}
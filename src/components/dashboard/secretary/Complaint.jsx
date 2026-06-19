import React, {
  useState,
  useMemo,
  useEffect,
  memo,
} from "react";

import {
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiTrash2,
  FiEdit2,
  FiFilter,
} from "react-icons/fi";

import {
  getComplaintsBySociety,
  updateComplaintStatus,
  deleteComplaint as deleteComplaintApi,
} from "../../../api/complaint";

const CATEGORY = [
  "All",
  "Maintenance",
  "Security",
  "Other",
];

const STATUS = [
  "All",
  "Pending",
  "In Progress",
  "Resolved",
];

const PRIORITY = [
  "All",
  "Low",
  "Medium",
  "High",
];

export default memo(function Complaint() {

  const [complaints, setComplaints] =
    useState([]);

  const [filters, setFilters] =
    useState({
      category: "All",
      status: "All",
      priority: "All",
    });

  const [editing, setEditing] =
    useState(null);

  const [edit, setEdit] =
    useState({
      status: "",
      assignedTo: "",
      priority: "",
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    (async () => {

      try {

        const societyId =
          localStorage.getItem(
            "secretarySocietyId"
          );

        if (!societyId) return;

        const data =
          await getComplaintsBySociety(
            societyId
          );

        setComplaints(
          (data || []).map((c) => ({
            id: c.id || c._id,

            title:
              c.title ||
              c.description ||
              "Complaint",

            description:
              c.description || "",

            category:
              c.category ||
              "Other",

            date:
              c.createdAt?.slice(
                0,
                10
              ),

            status:
              c.status ||
              "Pending",

            assignedTo:
              c.assignedTo || "",

            priority:
              c.priority ||
              "Medium",
          }))
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    })();

  }, []);

  /* =========================
     FILTERED LIST
  ========================= */

  const list = useMemo(
    () =>
      complaints.filter(
        (c) =>
          (filters.category ===
            "All" ||
            c.category ===
              filters.category) &&

          (filters.status ===
            "All" ||
            c.status ===
              filters.status) &&

          (filters.priority ===
            "All" ||
            c.priority ===
              filters.priority)
      ),
    [complaints, filters]
  );

  /* =========================
     COUNTS
  ========================= */

  const total =
    complaints.length;

  const pending =
    complaints.filter(
      (c) =>
        c.status === "Pending"
    ).length;

  const progress =
    complaints.filter(
      (c) =>
        c.status ===
        "In Progress"
    ).length;

  const resolved =
    complaints.filter(
      (c) =>
        c.status ===
        "Resolved"
    ).length;

  /* =========================
     EDIT
  ========================= */

  const open = (c) => {

    setEditing(c);

    setEdit({
      status: c.status,
      assignedTo:
        c.assignedTo,
      priority: c.priority,
    });
  };

  const save = async () => {

    try {

      await updateComplaintStatus(
        editing.id,
        edit.status,
        edit.priority
      );

      setComplaints((p) =>
        p.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                ...edit,
              }
            : x
        )
      );

      setEditing(null);

    } catch (err) {

      console.error(err);
    }
  };

  const remove = async (c) => {

    if (
      !window.confirm(
        "Delete complaint?"
      )
    )
      return;

    try {

      await deleteComplaintApi(
        c.id
      );

      setComplaints((p) =>
        p.filter(
          (x) => x.id !== c.id
        )
      );

    } catch (err) {

      console.error(err);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-slate-100 p-8 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Complaints
          </h1>

          <p className="text-gray-500 mt-1">
            Track and manage society issues efficiently
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow">
          <FiFilter />
          Complaint Management
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total"
          value={total}
          color="bg-indigo-500"
          icon={<FiAlertCircle />}
        />

        <StatCard
          title="Pending"
          value={pending}
          color="bg-yellow-500"
          icon={<FiClock />}
        />

        <StatCard
          title="In Progress"
          value={progress}
          color="bg-blue-500"
          icon={<FiEdit2 />}
        />

        <StatCard
          title="Resolved"
          value={resolved}
          color="bg-green-500"
          icon={<FiCheckCircle />}
        />
      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-2xl shadow p-5 flex flex-wrap gap-4">

        <SelectBox
          value={
            filters.category
          }
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              category: v,
            }))
          }
          options={CATEGORY}
        />

        <SelectBox
          value={
            filters.status
          }
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              status: v,
            }))
          }
          options={STATUS}
        />

        <SelectBox
          value={
            filters.priority
          }
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              priority: v,
            }))
          }
          options={PRIORITY}
        />
      </div>

      {/* LIST */}

      {loading ? (

        <div className="text-center py-20 text-gray-400">
          Loading complaints...
        </div>

      ) : list.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-400">
          No complaints found
        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {list.map((c) => (

            <div
              key={c.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 space-y-4"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {c.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {c.date}
                  </p>
                </div>

                <StatusBadge
                  status={
                    c.status
                  }
                />
              </div>

              {/* DESC */}

              <p className="text-sm text-gray-600 line-clamp-2">
                {c.description ||
                  "No description available"}
              </p>

              {/* TAGS */}

              <div className="flex items-center justify-between">

                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  {
                    c.category
                  }
                </span>

                <PriorityBadge
                  priority={
                    c.priority
                  }
                />
              </div>

              {/* ASSIGNED */}

              <div className="bg-slate-50 rounded-xl px-3 py-2 text-sm text-gray-600">
                Assigned To:
                <span className="font-medium ml-1 text-slate-800">
                  {c.assignedTo ||
                    "Not Assigned"}
                </span>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-2 pt-2">

                <button
                  onClick={() =>
                    open(c)
                  }
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm font-medium flex items-center gap-2"
                >
                  <FiEdit2 />
                  Edit
                </button>

                <button
                  onClick={() =>
                    remove(c)
                  }
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium flex items-center gap-2"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}

      {editing && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">

            <h2 className="text-2xl font-bold text-slate-800">
              Edit Complaint
            </h2>

            <SelectBox
              value={edit.status}
              onChange={(v) =>
                setEdit({
                  ...edit,
                  status: v,
                })
              }
              options={STATUS.filter(
                (x) =>
                  x !== "All"
              )}
            />

            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Assigned To"
              value={
                edit.assignedTo
              }
              onChange={(e) =>
                setEdit({
                  ...edit,
                  assignedTo:
                    e.target.value,
                })
              }
            />

            <SelectBox
              value={
                edit.priority
              }
              onChange={(v) =>
                setEdit({
                  ...edit,
                  priority: v,
                })
              }
              options={PRIORITY.filter(
                (x) =>
                  x !== "All"
              )}
            />

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() =>
                  setEditing(null)
                }
                className="px-4 py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

/* =========================
   COMPONENTS
========================= */

const SelectBox = ({
  value,
  onChange,
  options,
}) => (
  <select
    value={value}
    onChange={(e) =>
      onChange(e.target.value)
    }
    className="border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
  >
    {options.map((x) => (
      <option key={x}>
        {x}
      </option>
    ))}
  </select>
);

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm text-gray-400">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-slate-800 mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`${color} text-white p-4 rounded-2xl text-2xl`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const StatusBadge = ({
  status,
}) => {

  const styles = {
    Resolved:
      "bg-green-100 text-green-700",

    Pending:
      "bg-yellow-100 text-yellow-700",

    "In Progress":
      "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({
  priority,
}) => {

  const styles = {
    High:
      "bg-red-100 text-red-700",

    Medium:
      "bg-orange-100 text-orange-700",

    Low:
      "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[
          priority
        ] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
};
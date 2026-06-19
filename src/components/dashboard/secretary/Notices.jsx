// src/components/dashboard/secretary/Notices.jsx

import React, { useState, useEffect, useMemo, memo } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Search, Plus, Edit, Trash2, Bell, Calendar } from "lucide-react";

import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../../api/notice";

function Notices() {
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);

  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "General",
    date: "",
    validTill: "",
    desc: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const data = await getNotices();

        setNotices(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const open = (n = null, i = null) => {
    if (n) {
      setForm({
        title: n.title || "",

        category: n.category || "General",

        date: n.date?.slice(0, 10) || "",

        validTill: n.validTill?.slice(0, 10) || "",

        desc: n.desc || "",
      });

      setEditIndex(i);
    } else {
      setForm({
        title: "",
        category: "General",
        date: "",
        validTill: "",
        desc: "",
      });

      setEditIndex(null);
    }

    setModal(true);
  };

  const save = async () => {
    if (editIndex !== null) {
      const id = notices[editIndex].id || notices[editIndex]._id;

      const u = await updateNotice(id, form);

      setNotices((p) => p.map((x, i) => (i === editIndex ? u : x)));
    } else {
      const c = await createNotice(form);

      setNotices((p) => [c, ...p]);
    }

    setModal(false);
  };

  const remove = async (i) => {
    if (!window.confirm("Delete notice?")) return;

    const id = notices[i].id || notices[i]._id;

    await deleteNotice(id);

    setNotices((p) => p.filter((_, x) => x !== i));
  };

  const filtered = useMemo(
    () =>
      notices.filter((n) =>
        n.title?.toLowerCase().includes(search.toLowerCase()),
      ),

    [notices, search],
  );

  return (
    <div
      className="
min-h-screen
bg-gradient-to-br
from-slate-50
via-blue-50
to-white
p-6
space-y-6
"
    >
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
"
          >
            Notices
          </h1>

          <p
            className="
text-gray-500
"
          >
            Manage society announcements
          </p>
        </div>

        <button
          onClick={() => open()}
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
"
        >
          <Plus size={18} />
          New Notice
        </button>
      </div>

      {/* KPI */}

      <div
        className="
grid
md:grid-cols-3
gap-5
"
      >
        <Stat title="Total" value={notices.length} icon="📢" />

        <Stat title="Active" value={filtered.length} icon="📌" />

        <Stat title="Categories" value="4" icon="🗂" />
      </div>

      {/* SEARCH */}

      <div
        className="
relative
"
      >
        <Search
          className="
absolute
left-4
top-4
text-gray-400
"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="
Search notice
"
          className="
w-full
pl-12
p-3
rounded-2xl
border
bg-white
"
        />
      </div>

      {/* CARDS */}

      <div
        className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
"
      >
        {loading
          ? Array.from({
              length: 6,
            }).map((_, i) => (
              <div
                key={i}
                className="
h-[280px]
rounded-[32px]
bg-white
animate-pulse
"
              />
            ))
          : filtered.map((n, i) => (
              <motion.div
                key={n.id || n._id || i}
                whileHover={{
                  y: -4,
                }}
                className="
bg-white
rounded-[32px]
shadow-sm
hover:shadow-lg
transition
p-7
min-h-[280px]
flex
flex-col
justify-between
"
              >
                {/* TOP */}

                <div>
                  <div
                    className="
flex
justify-between
items-start
gap-4
"
                  >
                    <h3
                      className="
font-bold
text-xl
text-gray-900
line-clamp-2
"
                    >
                      {n.title}
                    </h3>

                    <span
                      className="
px-4
py-2
rounded-2xl
bg-blue-100
text-blue-700
text-sm
font-semibold
whitespace-nowrap
"
                    >
                      {n.category || "General"}
                    </span>
                  </div>

                  <p
                    className="
mt-5
text-gray-500
leading-7
line-clamp-4
min-h-[110px]
"
                  >
                    {n.desc || "No description"}
                  </p>
                </div>

                {/* FOOTER */}

                <div>
                  <div
                    className="
flex
justify-between
text-sm
text-gray-400
mb-5
"
                  >
                    <div>
                      📅
                      {n.date ? n.date.slice(0, 10) : "—"}
                    </div>

                    <div>⏳{n.validTill ? n.validTill.slice(0, 10) : "—"}</div>
                  </div>

                  <div
                    className="
flex
justify-end
gap-3
"
                  >
                    <button
                      onClick={() => open(n, i)}
                      className="
w-12
h-12
rounded-2xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
hover:bg-blue-100
"
                    >
                      <Edit size={22} />
                    </button>

                    <button
                      onClick={() => remove(i)}
                      className="
w-12
h-12
rounded-2xl
bg-red-50
text-red-500
flex
items-center
justify-center
hover:bg-red-100
"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {modal && (
          <div
            className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
grid
place-items-center
z-50
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
              className="
bg-white
w-full
max-w-lg
rounded-[32px]
p-6
space-y-4
"
            >
              <h2
                className="
text-2xl
font-bold
"
              >
                {editIndex !== null ? "Edit Notice" : "New Notice"}
              </h2>

              <input
                className="
border
rounded-2xl
p-3
w-full
"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className="
border
rounded-2xl
p-3
w-full
h-32
"
                placeholder="Description"
                value={form.desc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    desc: e.target.value,
                  })
                }
              />

              <div
                className="
flex
justify-end
gap-3
"
              >
                <button onClick={() => setModal(false)}>Cancel</button>

                <button
                  onClick={save}
                  className="
px-5
py-3
rounded-xl
bg-blue-600
text-white
"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div
      className="
bg-white
rounded-[32px]
shadow-sm
hover:shadow-lg
transition
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
          <p
            className="
text-gray-500
text-sm
"
          >
            {title}
          </p>

          <h2
            className="
text-4xl
font-bold
mt-2
"
          >
            {value}
          </h2>
        </div>

        <div
          className="
w-15
h-15
rounded-[28px]
bg-gradient-to-br
from-blue-50
to-indigo-100
flex
items-center
justify-center
text-5xl
shadow-inner
"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default memo(Notices);

import React, {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Home,
  User,
  Phone,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Camera,
  Clock3,
  Building2,
} from "lucide-react";

import { getMembers } from "../../../api/member";

export default function ResidentVerification() {

  const [search, setSearch] =
    useState("");

  const [members, setMembers] =
    useState([]);

  const [resident, setResident] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const [status, setStatus] =
    useState("CONFIRMED");

  const [notes, setNotes] =
    useState("");

  const societyId =
    localStorage.getItem(
      "secretarySocietyId"
    );

  /* ================= LOAD MEMBERS ================= */

  useEffect(() => {

    if (!societyId) {
      setApiError(
        "No society selected"
      );
      return;
    }

    const loadMembers =
      async () => {

        try {

          setLoading(true);

          const res =
            await getMembers(
              societyId
            );

          setMembers(
            Array.isArray(res)
              ? res
              : []
          );

        } catch (err) {

          console.error(err);

          setApiError(
            "Failed to load residents"
          );

        } finally {

          setLoading(false);

        }
      };

    loadMembers();

  }, [societyId]);

  /* ================= SEARCH ================= */

  const handleSearch = (e) => {

    e.preventDefault();

    if (!search.trim())
      return;

    setLoading(true);

    setResident(null);

    setTimeout(() => {

      const found =
        members.find((m) => {

          const flat =
            (
              m.flat ||
              m.flatNo ||
              m.flatNumber ||
              m.unit ||
              ""
            )
              .toString()
              .trim()
              .toUpperCase();

          return (
            flat ===
            search
              .trim()
              .toUpperCase()
          );
        });

      setResident(
        found || {
          error: true,
        }
      );

      setLoading(false);

    }, 600);
  };

  /* ================= SUBMIT ================= */

  const submitVerification =
    (e) => {

      e.preventDefault();

      if (
        !resident ||
        resident.error
      )
        return;

      alert(
        `Resident ${
          resident.fullName ||
          resident.name
        } verification ${status}`
      );

      setSearch("");
      setResident(null);
      setNotes("");
    };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="bg-sky-100 p-3 rounded-2xl">
                <ShieldCheck className="text-sky-600" />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-800">
                  Resident Verification
                </h1>

                <p className="text-slate-500 mt-1">
                  Watchman security verification system
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3 bg-slate-50 border rounded-2xl px-4 py-3">

            <Building2
              className="text-sky-600"
              size={18}
            />

            <div>

              <p className="text-xs text-slate-400">
                Active Society
              </p>

              <p className="font-semibold text-slate-700">
                {societyId ||
                  "Not Selected"}
              </p>

            </div>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5"
        >

          <div className="flex flex-col md:flex-row gap-4">

            <div className="flex-1 flex items-center border border-slate-200 rounded-2xl px-4 py-3">

              <Search
                className="text-sky-600 mr-3"
                size={20}
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Enter Flat Number (Eg. A-101)"
                className="w-full outline-none text-sm bg-transparent"
              />

            </div>

            <button
              className="bg-sky-600 hover:bg-sky-700 transition text-white px-8 py-3 rounded-2xl font-medium shadow"
            >
              Search Resident
            </button>

          </div>

        </form>

        {/* ================= LOADING ================= */}

        {loading && (

          <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 text-center">

            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-slate-500">
              Searching resident...
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {apiError && (

          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 flex items-center gap-3">

            <XCircle />

            <span>
              {apiError}
            </span>

          </div>
        )}

        {/* ================= NOT FOUND ================= */}

        {resident?.error && (

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-5 flex items-center gap-3">

            <XCircle />

            Resident not found for this flat number

          </div>
        )}

        {/* ================= VERIFIED CARD ================= */}

        {resident &&
          !resident.error && (

            <form
              onSubmit={
                submitVerification
              }
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >

              {/* TOP */}

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="bg-white/20 p-4 rounded-2xl">

                      <CheckCircle2 size={32} />

                    </div>

                    <div>

                      <h2 className="text-2xl font-bold">
                        Resident Verified
                      </h2>

                      <p className="text-green-100 text-sm mt-1">
                        Identity matched successfully
                      </p>

                    </div>

                  </div>

                  <div className="bg-white/10 rounded-2xl px-4 py-3">

                    <div className="flex items-center gap-2 text-sm">

                      <Clock3 size={16} />

                      {new Date().toLocaleString()}

                    </div>

                  </div>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6 grid lg:grid-cols-2 gap-5">

                <div className="bg-slate-50 rounded-2xl border p-5">

                  <p className="text-xs text-slate-400 mb-2">
                    Resident Name
                  </p>

                  <div className="flex items-center gap-3 text-slate-800 font-semibold text-lg">

                    <User
                      className="text-sky-600"
                      size={20}
                    />

                    {resident.fullName ||
                      resident.name ||
                      "Unknown"}

                  </div>

                </div>

                <div className="bg-slate-50 rounded-2xl border p-5">

                  <p className="text-xs text-slate-400 mb-2">
                    Phone Number
                  </p>

                  <div className="flex items-center gap-3 text-slate-800 font-semibold text-lg">

                    <Phone
                      className="text-sky-600"
                      size={20}
                    />

                    {resident.phone ||
                      "Not Available"}

                  </div>

                </div>

                <div className="bg-slate-50 rounded-2xl border p-5">

                  <p className="text-xs text-slate-400 mb-2">
                    Flat Number
                  </p>

                  <div className="flex items-center gap-3 text-slate-800 font-semibold text-lg">

                    <Home
                      className="text-sky-600"
                      size={20}
                    />

                    {resident.flat ||
                      resident.flatNo ||
                      resident.flatNumber ||
                      resident.unit}

                  </div>

                </div>

                <div className="bg-slate-50 rounded-2xl border p-5">

                  <p className="text-xs text-slate-400 mb-2">
                    Role
                  </p>

                  <div className="font-semibold text-lg text-slate-800">
                    {resident.role ||
                      "Resident"}
                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="border-t border-slate-200 p-6 space-y-5">

                <h3 className="font-semibold text-slate-700 text-lg">
                  Verification Decision
                </h3>

                <div className="flex flex-wrap gap-4">

                  <label className="flex items-center gap-3 border rounded-2xl px-5 py-3 cursor-pointer hover:bg-green-50">

                    <input
                      type="radio"
                      checked={
                        status ===
                        "CONFIRMED"
                      }
                      onChange={() =>
                        setStatus(
                          "CONFIRMED"
                        )
                      }
                    />

                    <span className="text-green-600 font-semibold flex items-center gap-2">

                      <CheckCircle2 size={18} />

                      Confirmed

                    </span>

                  </label>

                  <label className="flex items-center gap-3 border rounded-2xl px-5 py-3 cursor-pointer hover:bg-red-50">

                    <input
                      type="radio"
                      checked={
                        status ===
                        "DENIED"
                      }
                      onChange={() =>
                        setStatus(
                          "DENIED"
                        )
                      }
                    />

                    <span className="text-red-600 font-semibold flex items-center gap-2">

                      <XCircle size={18} />

                      Denied

                    </span>

                  </label>

                </div>

                {/* NOTES */}

                <div>

                  <label className="text-sm font-medium text-slate-600 mb-2 block">
                    Security Notes
                  </label>

                  <textarea
                    rows="4"
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                    placeholder="Enter watchman notes..."
                    className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-sky-300"
                  />

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setNotes("");
                    }}
                    className="px-5 py-3 rounded-2xl border hover:bg-slate-100 font-medium"
                  >
                    Reset
                  </button>

                  <button
                    className="bg-sky-600 hover:bg-sky-700 text-white px-7 py-3 rounded-2xl font-medium shadow"
                  >
                    Submit Verification
                  </button>

                </div>

              </div>

            </form>
          )}

        {/* ================= SECURITY TIPS ================= */}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <Camera className="text-sky-600 mb-3" />

            <h3 className="font-semibold text-slate-800">
              Camera Verification
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Capture visitor image before approval for security records.
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <ShieldCheck className="text-green-600 mb-3" />

            <h3 className="font-semibold text-slate-800">
              Secure Entry
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Only verified visitors are allowed inside the society.
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <Clock3 className="text-orange-500 mb-3" />

            <h3 className="font-semibold text-slate-800">
              Real-time Logs
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Every verification activity is stored in society logs.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
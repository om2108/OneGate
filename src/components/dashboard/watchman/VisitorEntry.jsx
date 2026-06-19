// src/components/dashboard/watchman/VisitorEntry.jsx

import React, { useState } from "react";

import {
  User,
  Phone,
  MapPin,
  Car,
  Building2,
  ClipboardList,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { addVisitor } from "../../../api/visitor";

const VisitorEntry = () => {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [visitorData, setVisitorData] =
    useState({
      name: "",
      contactNumber: "",
      purpose: "",
      vehicleNumber: "",
      flatNumber: "",
      visitorType: "Guest",
    });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setVisitorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const societyId =
        localStorage.getItem(
          "secretarySocietyId"
        );

      if (!societyId) {

        alert(
          "No society selected"
        );

        return;
      }

      const payload = {

        name:
          visitorData.name,

        phone:
          visitorData.contactNumber,

        purpose:
          visitorData.purpose,

        vehicleNumber:
          visitorData.vehicleNumber,

        flat:
          visitorData.flatNumber,

        type:
          visitorData.visitorType,

        societyId,

        status: "PENDING",

        createdAt:
          new Date().toISOString(),
      };

      console.log(
        "VISITOR PAYLOAD:",
        payload
      );

      await addVisitor(payload);

      alert(
        `Visitor entry created for ${visitorData.name}`
      );

      setVisitorData({
        name: "",
        contactNumber: "",
        purpose: "",
        vehicleNumber: "",
        flatNumber: "",
        visitorType: "Guest",
      });

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Failed to create visitor"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">

      {/* HEADER */}

      <div className="max-w-5xl mx-auto mb-6">

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Visitor Entry
            </h1>

            <p className="text-slate-500 mt-1">
              Register and manage visitor access professionally
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/dashboard/watchman/resident-verification"
              )
            }
            className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Resident Verification
          </button>

        </div>

      </div>

      {/* FORM */}

      <div className="max-w-5xl mx-auto">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT CARD */}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">

            <div>

              <h2 className="text-xl font-semibold text-slate-800">
                Society Security
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monitor all guest and delivery entries securely.
              </p>

            </div>

            <div className="space-y-4">

              <div className="bg-slate-100 rounded-2xl p-4">

                <p className="text-sm text-slate-500">
                  Today's Status
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  Active Entry
                </h3>

              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">

                <p className="text-sm text-blue-600">
                  Security Tip
                </p>

                <p className="text-sm text-slate-700 mt-2">
                  Verify visitor identity before granting entry.
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT FORM */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-slate-800">
                Visitor Information
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Fill all visitor details carefully
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ROW 1 */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                    <User size={18} />
                    Visitor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    value={visitorData.name}
                    onChange={handleChange}
                    placeholder="Enter visitor name"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                    <Phone size={18} />
                    Contact Number
                  </label>

                  <input
                    type="text"
                    name="contactNumber"
                    required
                    value={visitorData.contactNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              {/* ROW 2 */}

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                    <Building2 size={18} />
                    Flat Number
                  </label>

                  <input
                    type="text"
                    name="flatNumber"
                    required
                    value={visitorData.flatNumber}
                    onChange={handleChange}
                    placeholder="A-101"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div>

                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                    <ClipboardList size={18} />
                    Visitor Type
                  </label>

                  <select
                    name="visitorType"
                    value={visitorData.visitorType}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Guest">
                      Guest
                    </option>

                    <option value="Delivery">
                      Delivery
                    </option>

                    <option value="Service">
                      Service
                    </option>

                  </select>

                </div>

              </div>

              {/* PURPOSE */}

              <div>

                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <MapPin size={18} />
                  Purpose of Visit
                </label>

                <textarea
                  name="purpose"
                  required
                  rows="4"
                  value={visitorData.purpose}
                  onChange={handleChange}
                  placeholder="Purpose of visit..."
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              {/* VEHICLE */}

              <div>

                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Car size={18} />
                  Vehicle Number (Optional)
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  value={visitorData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="MH12AB1234"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* BUTTON */}

              <div className="pt-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-2xl shadow-lg"
                >
                  {loading
                    ? "Submitting..."
                    : "Create Visitor Entry"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VisitorEntry;
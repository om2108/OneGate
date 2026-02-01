import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Camera, User, Car, Check } from "lucide-react";

const ImageVerification = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [visitorName, setVisitorName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(false);

  const handleSendApproval = () => {
    alert("Request Sent for Approval!");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 sm:px-6 py-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-indigo-50 p-6">

        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-sky-600">
            Image Verification
          </h2>
          <p className="text-gray-500 text-sm">
            Capture visitor image and send for resident approval
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 📷 Camera Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-100">
              {!capturedPhoto ? (
                <button
                  onClick={() => setCapturedPhoto(true)}
                  className="flex flex-col items-center text-gray-500 hover:text-sky-600 transition"
                >
                  <Camera size={40} />
                  <span className="mt-2 text-sm">Capture Photo</span>
                </button>
              ) : (
                <div className="text-green-600 flex flex-col items-center">
                  <Check size={40} />
                  <span className="mt-2 font-medium">Photo Captured</span>
                </div>
              )}
            </div>

            {capturedPhoto && (
              <button
                onClick={() => setCapturedPhoto(false)}
                className="mt-4 text-sm text-sky-600 hover:underline"
              >
                Retake Photo
              </button>
            )}
          </div>

          {/* 📝 Form Section */}
          <div className="flex flex-col gap-5">

            {/* Visitor Name */}
            <div>
              <label className="flex items-center font-medium text-gray-700 mb-2">
                <User className="mr-2 text-sky-600" size={18} />
                Visitor Name
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Enter visitor name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="flex items-center font-medium text-gray-700 mb-2">
                <Car className="mr-2 text-sky-600" size={18} />
                Vehicle Number (Optional)
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="MH 01 AB 1234"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>

            {/* Quick Tags */}
            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                Quick Tags
              </label>
              <div className="flex gap-3">
                {["Delivery", "Guest", "Maintenance"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-sky-100 text-sky-600 cursor-pointer hover:bg-sky-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="accent-sky-600"
              />
              <span className="text-sm text-gray-600">
                Consent to record timestamp & location
              </span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleSendApproval}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send for Approval
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard/watchman/pending-approvals")}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Pending Approvals
              </button>
              <button
                onClick={() => navigate("/dashboard/watchman/approved-visitors")}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Approved Visitors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageVerification;
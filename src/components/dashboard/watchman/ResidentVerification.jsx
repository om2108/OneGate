import React, { useState } from "react";
import {
  Search,
  Home,
  User,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import RESIDENTS_MOCK_DATA from "../../data/ResidentsMockData.json";

const ResidentVerification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [residentData, setResidentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusConfirmed, setStatusConfirmed] = useState("confirmed");
  const [verificationNotes, setVerificationNotes] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toUpperCase().trim();
    if (!query) return;

    setIsLoading(true);
    setResidentData(null);

    setTimeout(() => {
      const data = RESIDENTS_MOCK_DATA[query];
      setResidentData(data || { error: `No resident found for unit ${query}` });
      setIsLoading(false);
    }, 800);
  };

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    if (!residentData || residentData.error) return;
    alert(
      `Verification logged for ${residentData.flatNumber}. Status: ${statusConfirmed}`
    );
    setSearchQuery("");
    setResidentData(null);
  };

  return (
    <div className="p-6 md:pl-16 max-w-full mx-auto">
      <div className="mb-6 border-b pb-2">
        <h2 className="text-sky-600 text-2xl font-bold">Resident Verification</h2>
        <p className="text-gray-500 text-sm">
          Enter the flat number to retrieve and confirm resident details.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex items-center w-full border border-gray-300 rounded-lg px-4 h-12 focus-within:ring-2 focus-within:ring-sky-400">
            <Search className="text-sky-600 mr-3" size={20} />
            <input
              type="text"
              placeholder="Enter Flat/Unit Number (e.g., A-101)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              disabled={isLoading}
              required
              className="flex-grow bg-transparent outline-none text-gray-800 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-sky-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Searching..." : "Search Resident"}
          </button>
        </form>
      </div>

      {/* Result Section */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-sky-50 text-sky-600 font-semibold text-center">
          Loading Resident Data...
        </div>
      )}

      {residentData && residentData.error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 font-semibold text-center">
          <h3 className="text-lg font-bold mb-1">Search Failed</h3>
          <p>{residentData.error}</p>
        </div>
      )}

      {residentData && !residentData.error && (
        <form
          onSubmit={handleSubmitVerification}
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 space-y-8"
        >
          <div className="pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 border-b border-dashed border-sky-100 pb-3 mb-4">
              <CheckCircle className="text-green-500" />
              <h3 className="text-green-600 font-semibold text-lg">
                RESIDENT FOUND - {residentData.flatNumber}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-y-3 gap-x-4 text-gray-800">
              <div className="flex items-center">
                <User className="text-sky-600 w-4 h-4 mr-2" /> {residentData.name}
              </div>
              <div className="flex items-center">
                <Phone className="text-sky-600 w-4 h-4 mr-2" /> {residentData.contact}
              </div>
              <div className="flex items-center">
                <Home className="text-sky-600 w-4 h-4 mr-2" />{" "}
                <span
                  className={`px-2 py-0.5 rounded-md text-sm font-semibold ${
                    residentData.status === "Owner"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {residentData.status}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="text-sky-600 w-4 h-4 mr-2" />{" "}
                Last Visitor: {residentData.lastVisitor}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg">
              Verification Confirmation
            </h3>

            <div className="flex flex-col gap-4">
              <label className="flex items-center text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="confirmed"
                  checked={statusConfirmed === "confirmed"}
                  onChange={() => setStatusConfirmed("confirmed")}
                  className="w-4 h-4 mr-2 accent-sky-600"
                />
                <CheckCircle className="text-green-500 w-4 h-4 mr-2" />
                Confirmed - Resident is present and verified
              </label>

              <label className="flex items-center text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="denied"
                  checked={statusConfirmed === "denied"}
                  onChange={() => setStatusConfirmed("denied")}
                  className="w-4 h-4 mr-2 accent-sky-600"
                />
                <AlertCircle className="text-yellow-500 w-4 h-4 mr-2" />
                Denied - Resident is not present or verification failed
              </label>
            </div>

            <label className="block mt-6 font-semibold text-gray-700">
              Verification Notes (Optional)
            </label>
            <textarea
              rows="4"
              placeholder="Add any specific observations or details..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 text-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setVerificationNotes("")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-lg border border-gray-300 transition"
              >
                Reset Notes
              </button>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Submit Verification
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResidentVerification;

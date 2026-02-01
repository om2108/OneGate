import React from 'react';
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
// FIX: Path updated to match your sidebar (src/components/dashboard/watchman -> src/data)
import visitorData from '../../data/visitor_data.json';

const ApprovalItem = ({ requester, visitor, status, time }) => {
  const handleResend = (name) => {
    alert(`Resending request for ${name}`);
  };

  const handleCancel = (name) => {
    alert(`Cancelling request for ${name}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-sky-200 transition">
      <div className="flex-1">
        <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{requester}</div>
        <div className="text-lg font-bold text-gray-800">{visitor}</div>
      </div>
      
      <div className="flex flex-col items-start sm:items-end">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 uppercase">
          {status}
        </span>
        <span className="text-gray-400 text-xs mt-1">{time}</span>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={() => handleResend(visitor)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-sky-50 text-sky-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sky-100 transition"
        >
          <RefreshCw size={14} /> Resend
        </button>
        <button 
          onClick={() => handleCancel(visitor)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          <XCircle size={14} /> Cancel
        </button>
      </div>
    </div>
  );
};

const PendingApprovals = () => {
  const navigate = useNavigate(); 

  // ADDED FILTER: Only include visitors with "Pending" status
  const pendingList = visitorData.filter(item => item.status === "Pending");

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-6 flex justify-center">
      <div className="w-full max-w-4xl">
        
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate("/dashboard/watchman/image-verification")}
            className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600 bg-white shadow-sm border border-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
            <p className="text-gray-500 text-sm">Review and manage active visitor requests</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Use the filtered 'pendingList' here */}
          {pendingList.length > 0 ? (
            pendingList.map((item) => (
              <ApprovalItem 
                key={item.id}
                requester={item.requester}
                visitor={item.visitor}
                status={item.status}
                time={item.time}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">No pending approvals found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;
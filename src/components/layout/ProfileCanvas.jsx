import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/profile";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProfileCanvas({ isOpen, onClose, onViewProfile }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchProfile = async () => {
      try {
        // ✅ No need to pass user.id — backend uses JWT
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [isOpen, user]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                className="text-gray-600 hover:text-gray-800 text-xl"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center gap-4">
              <img
                src={profile?.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
              <h3 className="mt-2 text-2xl font-bold">
                {profile?.fullName || user?.name || "—"}
              </h3>
              <p className="text-gray-600">{profile?.email || user?.email}</p>

              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-3"
                onClick={onViewProfile}
              >
                View / Edit Profile
              </button>

              <div className="flex flex-col gap-2 mt-4 w-full">
                <button
                  className="text-left text-blue-600 hover:underline"
                  onClick={() => navigate("/help")}
                >
                  Help
                </button>
                <button
                  className="text-left text-blue-600 hover:underline"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </button>
                <button
                  className="text-left text-red-500 hover:underline"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

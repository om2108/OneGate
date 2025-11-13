// src/components/profile/ProfileModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../api/profile";
import useCloudinaryUpload from "../../hooks/useUploadImage";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCamera,
  FaPen,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated Profile Modal (clean)
 * - Backdrop fade + modal scale & translate
 * - Inline editable fields: Full Name, Phone, Address
 * - Avatar upload via useCloudinaryUpload hook
 * - Created/Updated rows removed (as requested)
 */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function ProfileModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [profile, setProfile] = useState(null);

  const [editing, setEditing] = useState({}); // which fields are being edited
  const [draft, setDraft] = useState({}); // draft values while editing
  const [savingField, setSavingField] = useState(""); // field currently saving

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);
  const { uploadImage, uploading, progress } = useCloudinaryUpload();

  // Prevent background scroll when modal open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

  // Load profile when opening
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getProfile();
        if (!mounted) return;
        const safeData = data || {};
        setProfile(safeData);
        setDraft({
          fullName: safeData?.fullName || "",
          phone: safeData?.phone || "",
          address: safeData?.address || "",
        });
        setEditing({});
        setPreview(null);
      } catch (e) {
        console.error("Failed to load profile", e);
        if (mounted) setErr("Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Focus first input when opening and when switching into edit mode for a field
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
      }, 170);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const toggleEdit = (field, on = undefined) => {
    setEditing((prev) => ({ ...prev, [field]: on ?? !prev[field] }));
    if (on === false && profile) {
      // revert draft to profile value when cancelling
      setDraft((p) => ({ ...p, [field]: profile[field] || "" }));
    }
    if (on === true) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  };

  const saveField = async (field) => {
    if (!profile) return;
    const newVal = draft[field] ?? "";
    if ((profile[field] || "") === (newVal || "")) {
      toggleEdit(field, false);
      return;
    }
    try {
      setSavingField(field);
      await updateProfile({ [field]: newVal }); // API: partial update
      setProfile((p) => ({ ...(p || {}), [field]: newVal }));
      toggleEdit(field, false);
    } catch (e) {
      console.error("Failed to save field", e);
      alert("Could not save. Please try again.");
    } finally {
      setSavingField("");
    }
  };

  const onAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file);
      if (url) {
        await updateProfile({ image: url });
        setProfile((p) => ({ ...(p || {}), image: url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
      setPreview(null);
    }
  };

  // small helper
  const safe = (v) => (v && String(v).trim() ? v : "—");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.18 }}
        >
          {/* clickable dark backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Profile"
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* top accent */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

            {/* Header + avatar */}
            <div className="relative pt-6 pb-6 px-6 bg-white">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-rose-600 text-xl"
                aria-label="Close"
              >
                ✕
              </button>

              <h2 className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
                Profile
              </h2>

              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <img
                    src={
                      preview ||
                      profile?.image ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow"
                  />
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-1 right-1 grid place-items-center w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow"
                    title="Change photo"
                  >
                    <FaCamera size={14} />
                  </label>
                  <input
                    id="profileImage"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onAvatarPick}
                    className="hidden"
                  />
                </div>
              </div>

              {uploading && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Uploading photo… {Math.round(progress)}%
                </p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mx-auto" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : err ? (
                <div className="text-center text-rose-600">{err}</div>
              ) : (
                <>
                  <EditableInfoRow
                    icon={<FaUser className="text-blue-600" />}
                    label="Full Name"
                    value={profile?.fullName}
                    draft={draft.fullName}
                    editing={!!editing.fullName}
                    onEdit={() => toggleEdit("fullName", true)}
                    onCancel={() => toggleEdit("fullName", false)}
                    onChange={(v) => setDraft((d) => ({ ...d, fullName: v }))}
                    onSave={() => saveField("fullName")}
                    saving={savingField === "fullName"}
                    inputRef={firstInputRef}
                  />

                  <EditableInfoRow
                    icon={<FaPhone className="text-blue-600" />}
                    label="Phone"
                    value={profile?.phone}
                    draft={draft.phone}
                    editing={!!editing.phone}
                    onEdit={() => toggleEdit("phone", true)}
                    onCancel={() => toggleEdit("phone", false)}
                    onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                    onSave={() => saveField("phone")}
                    saving={savingField === "phone"}
                    inputProps={{ type: "tel", placeholder: "Enter phone number" }}
                  />

                  <EditableInfoRow
                    icon={<FaMapMarkerAlt className="text-blue-600" />}
                    label="Address"
                    value={profile?.address}
                    draft={draft.address}
                    editing={!!editing.address}
                    onEdit={() => toggleEdit("address", true)}
                    onCancel={() => toggleEdit("address", false)}
                    onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
                    onSave={() => saveField("address")}
                    saving={savingField === "address"}
                    inputAsTextArea
                  />

                  <StaticInfoRow
                    icon={<FaEnvelope className="text-gray-500" />}
                    label="Email"
                    value={safe(profile?.email)}
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Subcomponents (unchanged layout) ---------------- */

function StaticInfoRow({ icon, label, value }) {
  const show = value && String(value).trim() ? value : "—";
  return (
    <div className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm mb-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{show}</p>
      </div>
    </div>
  );
}

function EditableInfoRow({
  icon,
  label,
  value,
  draft,
  editing,
  onEdit,
  onCancel,
  onChange,
  onSave,
  saving,
  inputProps,
  inputAsTextArea = false,
  inputRef,
}) {
  const show = value && String(value).trim() ? value : "—";

  return (
    <div className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-xl p-3 shadow-sm mb-3">
      <div className="mt-0.5">{icon}</div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{label}</p>

          {!editing ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <FaPen className="text-gray-500" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={onSave}
                className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md ${
                  saving ? "bg-blue-300 text-white cursor-wait" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaCheck /> {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <p className="text-sm font-medium text-gray-800 mt-1 break-words">{show}</p>
        ) : inputAsTextArea ? (
          <textarea
            value={draft}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
            {...(inputProps || {})}
            ref={inputRef}
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
            {...(inputProps || {})}
            ref={inputRef}
          />
        )}
      </div>
    </div>
  );
}

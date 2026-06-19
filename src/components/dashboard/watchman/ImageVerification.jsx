import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Camera, RotateCcw, Bell, ArrowLeft } from "lucide-react";

import { uploadToCloudinary } from "../../../api/upload";

import { addVisitor } from "../../../api/visitor";

import { sendNotification } from "../../../api/notification";

export default function ImageVerification() {
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const canvasRef = useRef(null);

  const streamRef = useRef(null);

  const [camera, setCamera] = useState(false);

  const [photo, setPhoto] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    visitorName: "",

    flatNumber: "",

    vehicleNumber: "",

    purpose: "",

    notifyResident: false,

    residentId: "",
  });

  const societyId = localStorage.getItem("secretarySocietyId");

  const secretaryId = localStorage.getItem("secretaryId");

  const update = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((v) => ({
      ...v,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      streamRef.current = stream;

      setCamera(true);

      setTimeout(() => {
        videoRef.current.srcObject = stream;
      }, 150);
    } catch {
      alert("Allow camera");
    }
  };

  const capture = () => {
    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    canvas
      .getContext("2d")

      .drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File(
        [blob],

        "visitor.jpg",

        {
          type: "image/jpeg",
        },
      );

      setPhoto(file);

      setPreview(URL.createObjectURL(file));

      setCamera(false);

      stop();
    });
  };

  const submit = async () => {
    if (!photo || !form.visitorName || !form.flatNumber) {
      alert("Capture image");

      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadToCloudinary(
        photo,

        (p) => setProgress(p),
      );

      await addVisitor({
        ...form,

        societyId,

        imageUrl,

        approvalLevel: form.notifyResident ? "RESIDENT" : "SECRETARY",

        residentId: form.notifyResident ? form.residentId : null,

        secretaryDecision: "PENDING",

        residentDecision: "PENDING",

        imageVerified: false,

        status: "PENDING",

        createdBy: "WATCHMAN",

        createdById: localStorage.getItem("userId"),
      });

      await sendNotification(
        secretaryId,

        `Visitor ${form.visitorName}
waiting image verification`,
      );

      alert("Verification Sent");

      navigate("/dashboard/watchman/pending-approvals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
min-h-screen
bg-slate-100
p-8
"
    >
      <div
        className="
max-w-7xl
mx-auto
grid
lg:grid-cols-2
gap-8
"
      >
        <div
          className="
bg-white
rounded-[32px]
overflow-hidden
shadow
"
        >
          <div
            className="
h-[520px]
relative
bg-slate-100
"
          >
            {preview ? (
              <img
                src={preview}
                className="
w-full
h-full
object-cover
"
              />
            ) : (
              <div
                className="
h-full
grid
place-items-center
"
              >
                <button
                  onClick={openCamera}
                  className="
bg-blue-600
text-white
rounded-full
px-10
py-5
"
                >
                  <Camera />
                  Open Camera
                </button>
              </div>
            )}
          </div>

          {preview && (
            <button
              onClick={() => {
                setPreview("");
                setPhoto(null);
              }}
              className="
m-5
bg-black
text-white
px-6
py-3
rounded-xl
"
            >
              <RotateCcw />
              Retake
            </button>
          )}
        </div>

        <div
          className="
bg-white
rounded-[32px]
p-8
space-y-4
shadow
"
        >
          <h1
            className="
text-3xl
font-bold
"
          >
            Visitor Verification
          </h1>

          <input
            name="visitorName"
            placeholder="Visitor Name"
            onChange={update}
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="flatNumber"
            placeholder="Flat Number"
            onChange={update}
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="vehicleNumber"
            placeholder="Vehicle"
            onChange={update}
            className="w-full border p-4 rounded-xl"
          />

          <textarea
            rows="4"
            name="purpose"
            placeholder="Purpose"
            onChange={update}
            className="w-full border p-4 rounded-xl"
          />

          <label
            className="
flex
gap-3
"
          >
            <input type="checkbox" name="notifyResident" onChange={update} />
            <Bell />
            Resident Approval
          </label>

          {form.notifyResident && (
            <input
              name="residentId"
              placeholder="Resident Id"
              onChange={update}
              className="w-full border p-4 rounded-xl"
            />
          )}

          <button
            onClick={submit}
            className="
w-full
bg-green-600
text-white
py-4
rounded-xl
"
          >
            {loading ? `Uploading ${progress}%` : "Send Verification"}
          </button>
        </div>
      </div>

      {camera && (
        <div
          className="
fixed
inset-0
bg-black
z-[999]
"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="
w-full
h-full
object-cover
"
          />

          <button
            onClick={() => {
              setCamera(false);
              stop();
            }}
            className="
absolute
top-6
left-6
bg-white
p-3
rounded-full
"
          >
            <ArrowLeft />
          </button>

          <button
            onClick={capture}
            className="
absolute
bottom-10
left-1/2
-translate-x-1/2
w-24
h-24
rounded-full
bg-white
border-[10px]
border-blue-600
"
          ></button>

          <canvas hidden ref={canvasRef} />
        </div>
      )}
    </div>
  );
}

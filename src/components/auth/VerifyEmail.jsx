import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../api/auth";
import bgImage from "../../assets/t.jpg";

export default function VerifyEmail() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(30); // seconds for resend
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  // Masked email display
  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    const visible = user.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(user.length - 2, 0))}@${domain}`;
  }, [email]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const code = digits.join("");
  const isComplete = code.length === 6 && digits.every((d) => d !== "");

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return; // allow only single digit
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = idx - 1;
      const next = [...digits];
      next[prev] = "";
      setDigits(next);
      inputsRef.current[prev]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array.from({ length: 6 }, (_, i) => text[i] || "");
    setDigits(next);
    const focusIdx = Math.min(text.length, 5);
    inputsRef.current[focusIdx]?.focus();
    e.preventDefault();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return setMessage("Email not found. Please register again.");
    if (!isComplete) return setMessage("Please enter the 6-digit code.");
    setSubmitting(true);
    setMessage("");
    try {
      const res = await verifyEmail(email, code);
      setMessage(res.message || "Verified successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    if (!email) return setMessage("Email not found. Please register again.");
    try {
      setCooldown(30);
      // TODO: call your resend endpoint here, e.g.:
      // await resendOtp(email)
      setMessage("A new code has been sent to your email.");
    } catch {
      setMessage("Could not resend code. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/25 to-transparent" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-black/5 p-6 sm:p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-2 text-sm text-gray-700">
            We sent a 6-digit code to <span className="font-semibold">{maskedEmail}</span>
          </p>

          {message && (
            <div className="mt-4 rounded-lg border p-3 text-sm
              bg-gray-50 text-gray-800 border-gray-200">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-6 space-y-5">
            {/* OTP boxes */}
            <div
              className="flex justify-center gap-2"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-12 rounded-lg border border-gray-300 bg-white/90 text-center text-lg
                             shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isComplete || submitting}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 font-semibold text-white shadow-md
                         transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-5 text-sm text-gray-700">
            Didn&apos;t get the code?{" "}
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className="font-semibold text-blue-600 hover:underline disabled:text-gray-400"
            >
              Resend {cooldown > 0 ? `in ${cooldown}s` : "code"}
            </button>
          </div>

          {/* Help */}
          <p className="mt-3 text-xs text-gray-600">
            Tip: Check your Spam/Promotions folder if you don&apos;t see the email.
          </p>
        </div>
      </div>
    </div>
  );
}

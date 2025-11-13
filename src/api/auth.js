import api from "./api";

export const registerUser = async (data) => {
  const payload = {
    ...data,
    role: data.role?.toUpperCase() || "USER",
  };
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// ✅ FIXED verifyEmail — backend expects { email, code }
export const verifyEmail = async (email, code) => {
  const res = await api.post("/auth/verify-otp", { email, code });
  return res.data;
};

export const resendOTP = async (email) => {
  const res = await api.post("/auth/resend", { email });
  return res.data;
};

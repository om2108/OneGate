// src/api/profile.js

import api from "./api";

// ✅ Get logged-in user profile
export const getProfile = async () => {
  try {
    const res = await api.get("/profile");

    return res.data;
  } catch (err) {
    console.error(
      "GET PROFILE ERROR:",
      err.response?.data || err.message
    );

    throw err;
  }
};

// ✅ Update profile
export const updateProfile = async (data) => {
  try {
    const res = await api.put(
      "/profile",
      data
    );

    return res.data;
  } catch (err) {
    console.error(
      "UPDATE PROFILE ERROR:",
      err.response?.data || err.message
    );

    throw err;
  }
};

export const getProfileByUserId =
  async (userId) => {
    try {
      const res = await api.get(
        `/profile/user/${userId}`
      );

      return res.data;

    } catch (err) {
      console.error(
        "GET PROFILE BY USER ID ERROR:",
        err.response?.data ||
          err.message
      );

      return null;
    }
  };
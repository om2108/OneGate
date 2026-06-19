// src/api/user.js

import api from "./api";

// ✅ GET all users
export const getAllUsers = async () => {
  try {
    const res = await api.get("/users");

    console.log(
      "USERS API RESPONSE:",
      res.data
    );

    return res.data;
  } catch (err) {
    console.error(
      "GET USERS ERROR:",
      err.response?.data ||
        err.message
    );

    throw err;
  }
};

// ✅ GET user by ID
export const getUserById =
  async (id) => {
    try {
      const res = await api.get(
        `/users/${id}`
      );

      return res.data;
    } catch (err) {
      console.error(
        "GET USER ERROR:",
        err.response?.data ||
          err.message
      );

      throw err;
    }
  };

// ✅ Public users
export const getPublicUsers =
  async () => {
    try {
      const res = await api.get(
        "/users/public"
      );

      return res.data;
    } catch (err) {
      console.error(
        "PUBLIC USERS ERROR:",
        err.response?.data ||
          err.message
      );

      throw err;
    }
  };

// ✅ Invite user
export const inviteUser =
  async (payload) => {
    try {
      const res = await api.post(
        "/users/invite",
        payload
      );

      return res.data;
    } catch (err) {
      console.error(
        "INVITE USER ERROR:",
        err.response?.data ||
          err.message
      );

      throw err;
    }
  };

// ✅ Update role
export const updateUserRole =
  async (id, payload) => {
    try {
      console.log(
        "UPDATING ROLE:",
        id,
        payload
      );

      const res = await api.put(
        `/users/${id}/role`,
        payload
      );

      return res.data;
    } catch (err) {
      console.error(
        "UPDATE ROLE ERROR:",
        err.response?.status,
        err.response?.data ||
          err.message
      );

      throw err;
    }
  };

// ✅ Delete user
export const deleteUser =
  async (id) => {
    try {
      const res = await api.delete(
        `/users/${id}`
      );

      return res.data;
    } catch (err) {
      console.error(
        "DELETE USER ERROR:",
        err.response?.data ||
          err.message
      );

      throw err;
    }
  };
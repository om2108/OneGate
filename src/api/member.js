import api from "./api";

export const getMembers = async (societyId) => {
  const res = await api.get(
    "/members",
    {
      params: {
        societyId
      }
    }
  );

  return res.data;
};

export const getMemberByUserId =
async (userId) => {

  const res =
    await api.get(
      `/members/user/${userId}`
    );

  return res.data;
};

export const addMember =
async (data) => {

  const res =
    await api.post(
      "/members",
      data
    );

  return res.data;
};

export const updateMemberRole =
async (
  id,
  payload
) => {

  const res =
    await api.put(
      `/members/${id}/role`,
      payload
    );

  return res.data;
};

export const deleteMember =
async (id) => {

  const res =
    await api.delete(
      `/members/${id}`
    );

  return res.data;
};
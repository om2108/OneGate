import api from "./api";

export const getMaintenance =
async (
  societyId,
  userId = null
) => {

  const res =
    await api.get(
      "/maintenance",
      {
        params: {
          societyId,
          userId
        }
      }
    );

  return res.data;
};

export const createOrder =
async (id) => {

  const res =
    await api.post(
      `/maintenance/${id}/create-order`
    );

  return res.data;
};

export const verifyPayment =
async (
  id,
  data
) => {

  const res =
    await api.post(
      `/maintenance/${id}/verify`,
      data
    );

  return res.data;
};
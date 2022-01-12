import axiosInstance from "./axiosInstance";

export const login = (data) => axiosInstance.post("auth/login", data);
export const logout = (token) =>
  axiosInstance.post("auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });

export const addUserApi = ({ token, data }) =>
  axiosInstance.post("admin/createUser", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUsersApi = ({ token }) =>
  axiosInstance.get("admin/allUsers", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getUsersDetails = ({ token, userId }) =>
  axiosInstance.get(`admin/userProfile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateUserApi = ({ token, data, userId }) =>
  axiosInstance.patch(`admin/updateUser/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteUserApi = ({ token, userId }) =>
  axiosInstance.delete(`admin/deleteUser/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const addCardApi = ({ token, data, userId }) =>
  axiosInstance.post(`admin/saveCard/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCardApi = ({ token, data, cardId }) =>
  axiosInstance.patch(`admin/updateCard/${cardId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteCardApi = ({ token, cardId }) =>
  axiosInstance.delete(`admin/deleteCard/${cardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getBraintreeToken = ({ token, userId }) =>
  axiosInstance.get(`admin/clientToken/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getAllTransaction = ({ token }) =>
  axiosInstance.get(`admin/allPayments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const cargeUserApi = ({ token, data, userId }) =>
  axiosInstance.post(`admin/charge/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const refundUserApi = ({ token, data, transactionId }) =>
  axiosInstance.post(`admin/refund/${transactionId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const changePasswordApi = ({ token, data }) =>
  axiosInstance.patch(`auth/changePassword`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

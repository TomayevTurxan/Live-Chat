import axiosInstance from "../../utils/axiosInstance";

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};
export const getUserChatsApi = async (userId) => {
  const response = await axiosInstance.get(`/chats/${userId}`);
  return response.data;
};

export const getRecipientUserApi = async (recipientId) => {
  const response = await axiosInstance.get(`/users/findUser/${recipientId}`);
  return response.data;
};

export const allUsersApi = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

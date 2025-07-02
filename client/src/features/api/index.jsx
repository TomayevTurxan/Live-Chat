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
  console.log('recipientIdrecipientId4',recipientId)
  const response = await axiosInstance.get(`/users/findUser/${recipientId}`);
  return response.data;
};

export const allUsersApi = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const createChatApi = async (data) => {
  const response = await axiosInstance.post("/chats", data);
  return response.data;
};

export const getMessagesApi = async (messageId) => {
  const response = await axiosInstance.get(`messages/${messageId}`);
  return response.data;
};

export const postMessage = async (data) => {
  const response = await axiosInstance.post(`messages`, data);
  return response.data;
};

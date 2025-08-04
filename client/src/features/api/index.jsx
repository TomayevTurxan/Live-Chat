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

export const deleteMessage = async (messageId) => {
  const response = await axiosInstance.delete(`messages/${messageId}`);
  return response.data;
};

export const editMessage = async (messageId, data) => {
  const response = await axiosInstance.put(`messages/${messageId}`, data);
  return response.data;
};

export const getWithLastMessageApi = async (userId) => {
  const response = await axiosInstance.get(`chats/withLastMessage/${userId}`);
  return response.data;
};

export const getPotentialChatsUserApi = async (userId) => {
  const response = await axiosInstance.get(
    `users/potentialChatsUser/${userId}`
  );
  return response.data;
};

export const blockUser = async (data) => {
  const response = await axiosInstance.post(`users/blockUser`, data);
  return response.data;
};

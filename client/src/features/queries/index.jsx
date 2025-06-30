import { useQuery } from "@tanstack/react-query";
import { allUsersApi, getRecipientUserApi, getUserChatsApi } from "../api";

export const keys = {
  base: ["chats"],
  get userChats() {
    return [...this.base, "userChats"];
  },
  getUserChats(userId) {
    return [...this.base, userId];
  },
  get recipientUser() {
    return [...this.base, "recipientUser"];
  },
  getRecepientUser(recipientId) {
    return [...this.recipientUser, recipientId];
  },
  get allUsers() {
    return [...this.base, "allUsers"];
  },
  getAllUsers() {
    return [...this.allUsers];
  },
};

export function useUserChats(userId) {
  return useQuery({
    queryKey: keys.getUserChats(userId),
    queryFn: () => getUserChatsApi(userId),
  });
}

export function useRecipientUser(recipientId) {
  return useQuery({
    queryKey: keys.getRecepientUser(recipientId),
    queryFn: () => getRecipientUserApi(recipientId),
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: keys.getAllUsers(),
    queryFn: () => allUsersApi(),
  });
}
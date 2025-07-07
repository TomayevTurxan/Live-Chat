import { useQuery } from "@tanstack/react-query";
import {
  allUsersApi,
  getMessagesApi,
  getRecipientUserApi,
  getUserChatsApi,
  getWithLastMessageApi,
} from "../api";

export const keys = {
  base: ["chats"],
  get userChats() {
    return [...this.base, "userChats"];
  },
  getUserChats(userId) {
    return [...this.userChats, userId];
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
  get messages() {
    return [...this.base, "messages"];
  },
  getMessages(messageId) {
    return [...this.messages, messageId];
  },
  get withLastMessage() {
    return [...this.base, "withLastMessage"];
  },
  getWithLastMessage(userId) {
    return [...this.withLastMessage, userId];
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
    enabled: !!recipientId,
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: keys.getAllUsers(),
    queryFn: () => allUsersApi(),
  });
}

export function useGetMessages(messageId) {
  return useQuery({
    queryKey: keys.getMessages(messageId),
    queryFn: () => getMessagesApi(messageId),
  });
}

export function useWithLastMessages(userId) {
  return useQuery({
    queryKey: keys.getWithLastMessage(userId),
    queryFn: () => getWithLastMessageApi(userId),
  });
}

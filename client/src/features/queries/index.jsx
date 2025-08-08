import { useQuery } from "@tanstack/react-query";
import {
  allUsersApi,
  getInComingChatRequests,
  getMessagesApi,
  getPotentialChatsUserApi,
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
  getRecipientUser(recipientId) {
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
  get potentialChatUsers() {
    return [...this.base, "potentialChatUsers"];
  },
  getPotentialChatUsers(userId) {
    return [...this.potentialChatUsers, userId];
  },
  get incomingChatRequests() {
    return [...this.base, "incomingChatRequests"];
  },
  getIncomingChatRequests(userId) {
    return [...this.incomingChatRequests, userId];
  },
};

export function useUserChats(userId) {
  return useQuery({
    queryKey: keys.getUserChats(userId),
    queryFn: () => getUserChatsApi(userId),
    enabled: !!userId,
    refetchIntervalInBackground: true, 
    refetchOnWindowFocus: true,
  });
}

export function useRecipientUser(recipientId) {
  return useQuery({
    queryKey: keys.getRecipientUser(recipientId),
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
    enabled: !!messageId,
  });
}

export function useWithLastMessages(userId) {
  return useQuery({
    queryKey: keys.getWithLastMessage(userId),
    queryFn: () => getWithLastMessageApi(userId),
  });
}

export function usePotentialChatsUser(userId) {
  return useQuery({
    queryKey: keys.getPotentialChatUsers(userId),
    queryFn: () => getPotentialChatsUserApi(userId),
  });
}

export function useIncomingChatRequests(userId) {
  return useQuery({
    queryKey: keys.getIncomingChatRequests(userId),
    queryFn: () => getInComingChatRequests(userId),
  });
}

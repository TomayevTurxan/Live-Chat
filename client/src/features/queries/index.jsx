import { useQuery } from "@tanstack/react-query";
import { getUserChatsApi } from "../api";

export const keys = {
  base: ["chats"],
  get userChats() {
    return [...this.base, "userChats"];
  },
  getUserChats(userId) {
    return [...this.base, userId];
  },
};

export function useUserChats(userId) {
  return useQuery({
    queryKey: keys.getUserChats(userId),
    queryFn: () => getUserChatsApi(userId),
  });
}

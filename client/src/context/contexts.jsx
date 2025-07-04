import { useContext } from "react";
import UserContext from "./UserInfo";
import ChatContext from "./ChatContext";
import ChatDataContext from "./ChatContext";

export const useUser = () => useContext(UserContext);
export const useUserChats = () => useContext(ChatContext);
export const useChatData = () => useContext(ChatDataContext);

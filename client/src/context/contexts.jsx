import { useContext } from "react";
import UserContext from "./UserInfo";
import ChatContext from "./ChatContext";

export const useUser = () => useContext(UserContext);
export const useChatData = () => useContext(ChatContext);

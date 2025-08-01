import { useChatData, useUser } from "../../context/contexts";
import { useContext } from "react";
import UserContext from "../../context/UserInfo";
import useSocketHandlers from "../../hooks/useSocketHandlers";
import useNotificationHandler from "../../hooks/useNotificationHandler";
import MessagesList from "./MessageList";

const ChatMessages = ({ currentChat }) => {
  const { userInfo } = useUser();
  const { notifications, setNotifications } = useChatData();
  const { socket } = useContext(UserContext);

  useSocketHandlers(socket, currentChat, userInfo, setNotifications);
  useNotificationHandler(currentChat, notifications, setNotifications);

  return <MessagesList userInfo={userInfo} currentChat={currentChat} />;
};

export default ChatMessages;

import { LinearProgress } from "@mui/material";
import { useChatData, useUser } from "../../context/contexts";
import { useContext, useEffect } from "react";
import { useGetMessages } from "../../features/queries";
import UserContext from "../../context/UserInfo";
import useSocketHandlers from "../../hooks/useSocketHandlers";
import useNotificationHandler from "../../hooks/useNotificationHandler";
import MessagesList from "./MessageList";

const ChatMessages = ({ currentChat }) => {
  const { userInfo } = useUser();
  const { notifications, setNotifications, setMessages, messages } =
    useChatData();
  const { data: fetchedMessages, isLoading } = useGetMessages(currentChat?._id);
  const { socket } = useContext(UserContext);

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages, setMessages]);

  useSocketHandlers(
    socket,
    currentChat,
    userInfo,
    setMessages,
    setNotifications
  );
  useNotificationHandler(currentChat, notifications, setNotifications);

  if (isLoading) return <LinearProgress />;

  return (
    <MessagesList
      setMessages={setMessages}
      messages={messages}
      userInfo={userInfo}
    />
  );
};

export default ChatMessages;

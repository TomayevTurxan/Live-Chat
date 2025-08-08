import { keys } from "../features/queries";

export const updateLastMessagesCache = ({
  queryClient,
  userId,
  res,
  currentChatId,
}) => {
  queryClient.setQueryData(keys.getWithLastMessage(userId), (old = []) => {
    const updated = old.map((chat) =>
      chat.chatId === res.chatId
        ? {
            ...chat,
            lastMessage: {
              ...res,
              isRead: currentChatId === res.chatId,
            },
          }
        : chat
    );

    const exists = old.some((chat) => chat.chatId === res.chatId);
    if (!exists) {
      updated.push({
        chatId: res.chatId,
        members: [res.senderId, userId],
        lastMessage: { ...res, isRead: currentChatId === res.chatId },
      });
    }

    return updated;
  });
};

import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  createChatApi,
  postMessage,
  blockUser,
  deleteMessage,
  editMessage,
} from "../api";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useCreateChat = () => {
  return useMutation({
    mutationFn: (data) => {
      return createChatApi(data);
    },
  });
};

export const usePostMessage = () => {
  return useMutation({
    mutationFn: (data) => {
      return postMessage(data);
    },
  });
};

export const useBlockUser = () => {
  return useMutation({
    mutationFn: (data) => {
      return blockUser(data);
    },
  });
};

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: (messageId) => {
      return deleteMessage(messageId);
    },
  });
};

export const useEditMessage = () => {
  return useMutation({
    mutationFn: (messageId) => {
      return editMessage(messageId);
    },
  });
};

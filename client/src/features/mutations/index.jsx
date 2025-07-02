import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, createChatApi, postMessage } from "../api";

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

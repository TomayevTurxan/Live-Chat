import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

const UserContext = createContext({
  userInfo: null,
  setUserInfo: () => {},
});

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  //configuration socket
  useEffect(() => {
    if (userInfo?._id) {
      const newSocket = io("http://localhost:3000", {
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: true,
      });
      if (newSocket) {
        setSocket(newSocket);
      }

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userInfo]);

  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userInfo?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        onlineUsers,
        setOnlineUsers,
        socket,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

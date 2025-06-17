import { LightMode, DarkMode as DarkModeIcon } from "@mui/icons-material";
import { IconButton, useColorScheme } from "@mui/material";
import React from "react";

const Chat = () => {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  return (
    <>
      <IconButton onClick={handleToggle} color="inherit">
        {mode === "dark" ? <DarkModeIcon /> : <LightMode />}
      </IconButton>
    </>
  );
};

export default Chat;

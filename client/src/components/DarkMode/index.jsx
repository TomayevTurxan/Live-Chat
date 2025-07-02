import { IconButton, useColorScheme } from "@mui/material";
import { LightMode, DarkMode as DarkModeIcon } from "@mui/icons-material";

const DarkMode = () => {
  const { mode, setMode } = useColorScheme();

  const handleToggleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  return (
    <IconButton onClick={handleToggleTheme} color="inherit">
      {mode === "dark" ? <DarkModeIcon /> : <LightMode />}
    </IconButton>
  );
};

export default DarkMode;
    
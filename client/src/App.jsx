import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./App.css";
import theme from "./theme";

function Providers() {
  return <RouterProvider router={router} />;
}
function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <Providers />
    </ThemeProvider>
  );
}

export default App;

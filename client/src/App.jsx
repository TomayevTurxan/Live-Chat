import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./App.css";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserInfo";

function Providers() {
  return <RouterProvider router={router} />;
}
function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <UserProvider>
        <Providers />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

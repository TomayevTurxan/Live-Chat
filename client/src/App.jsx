import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./App.css";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserInfo";
import { PotentialChatProvider } from "./context/PotentialChatContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatDataProvider } from "./context/ChatContext";
import { CallProvider } from "./context/CallContext";

const queryClient = new QueryClient();

function Providers() {
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <ToastContainer position="top-right" autoClose={3000} />
        <UserProvider>
          <ChatDataProvider>
            <PotentialChatProvider>
              <CallProvider>
                <Providers />
              </CallProvider>
            </PotentialChatProvider>
          </ChatDataProvider>
        </UserProvider> 
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

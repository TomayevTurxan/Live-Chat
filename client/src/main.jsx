import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./utils/polyfills.js";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </>
);

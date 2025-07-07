import { Navigate } from "react-router-dom";
import Chat from "../pages/Chat";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

const routes = [
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
];

export default routes;

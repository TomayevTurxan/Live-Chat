import { Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../pages/Chat/Chat";
import UserDetail from "../pages/Chat/UserDetail";
import VideoCall from "../pages/Chat/VideoCall";

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
    children: [
      {
        path: "user/:userId",
        element: <UserDetail />,
      },
    ],
  },
  {
    path: "/videoCall",
    element: <VideoCall />,
  },
];

export default routes;

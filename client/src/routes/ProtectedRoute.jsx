import { Navigate } from "react-router-dom";
import { useUser } from "../context/contexts";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useUser();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

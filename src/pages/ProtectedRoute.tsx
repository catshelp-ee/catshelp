import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../authContext.tsx";

const ProtectedRoute = () => {
  const { user, setUser } = useAuth();
  const isAuthed = user !== null;
  return isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

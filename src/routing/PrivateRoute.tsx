import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const PrivateRoute = () => {
  const { user, isLoading: isUserLoading } = useUser();

  if (isUserLoading) return null;

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;

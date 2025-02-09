import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const PrivateRoute = () => {

  const { user } = useUser();

  return user ? <Outlet /> : <Navigate to="/"/>;
};

export default PrivateRoute;

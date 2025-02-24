import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const ModeratorRoute = () => {
  const { user, isLoading: isUserLoading } = useUser();

  // Mostrar un loader mientras los datos están cargando
  if (isUserLoading) return null;

  // Verificar si el usuario es un moderador
  const isAuthenticated = user && (user?.role.name === "Administrador") || (user?.role.name === "Moderador");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ModeratorRoute;

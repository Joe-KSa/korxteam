import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useModeratorById } from "@/hooks/useModeratorById";

const ModeratorRoute = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { moderator, isLoading: isModeratorLoading } = useModeratorById(user?.id);

  // Mostrar un loader mientras los datos están cargando
  if (isUserLoading || isModeratorLoading) return null; // Puedes reemplazar con un loader

  // Verificar si el usuario es un moderador
  const isAuthenticated = user && moderator?.role.name === "Moderador";

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ModeratorRoute;

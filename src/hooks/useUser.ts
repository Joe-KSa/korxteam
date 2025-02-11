import { useEffect, useState, useRef } from "react";
import { UserService } from "@/core/services/user/userService";
import { userStore } from "@/store/store";

export const useUser = () => {
  const { user, setUser, hasFetched, setHasFetched } = userStore();
  const [isLoading, setIsLoading] = useState(!hasFetched);
  const isFetching = useRef(false); // Evitar múltiples llamadas simultáneas

  useEffect(() => {
    if (hasFetched || isFetching.current) return;

    const fetchUser = async () => {
      isFetching.current = true;
      setIsLoading(true);
      try {
        const userData = await new UserService().getUser();
        if (userData) setUser(userData); // Solo actualiza si hay datos
      } catch {
        console.warn("No se pudo obtener el usuario.");
      } finally {
        setHasFetched(true); // Siempre marcar como obtenido para evitar más llamadas
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    fetchUser();
  }, [hasFetched, setUser, setHasFetched]);

  return { user, isLoading };
};

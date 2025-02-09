import { useEffect, useState } from "react";
import { UserService } from "@/core/services/user/userService";
import { userStore } from "@/store/store";

export const useUser = () => {
  const { user, setUser } = userStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await new UserService().getUser();
        setUser(userData || null);
      } catch (error) {
        console.error("Error al intentar obtener los datos del usuario", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
};

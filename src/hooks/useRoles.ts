import { useEffect } from "react";
import { RoleService } from "@/core/services/role/roleService";
import { rolStore } from "@/store/store";

export const useRoles = () => {
  const { roles, setRoles } = rolStore();

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesData = await new RoleService().getRoles();
      const roles = rolesData.map((role) => ({ id: role.id, name: role.name }));
      setRoles(roles);
    };

    fetchRoles();
  }, []);

  return { roles };
};

import { create } from "zustand";
import { UserService } from "@/core/services/user/userService";

export type Permission = string;

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface RoleState {
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  fetchUserRoles: (userId: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  permissions: [],
  loading: false,
  fetchUserRoles: async (userId: string) => {
    set({ loading: true });
    try {
      // Obtén los roles y permisos desde tu base de datos
      const rolesFromDB: Role[] = await new UserService().getUserPermissions(
        userId
      );
      const rolesArray = Array.isArray(rolesFromDB) ? rolesFromDB : [rolesFromDB];

      const allPermissions = Array.from(
        new Set(rolesArray.flatMap((role) => role.permissions))
      );
      set({ roles: rolesArray, permissions: allPermissions });
    } catch (error) {
      console.error("Error fetching user roles:", error);
    } finally {
      set({ loading: false });
    }
  },
  hasPermission: (permission: Permission) => {
    const result = get().permissions.includes(permission);
    return result;
  },  
}));

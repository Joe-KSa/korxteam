import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";
import type { getMemberProps } from "@/core/types";
import { UserService } from "../../core/services/user/userService";

import { useMembers } from "@/hooks/useMembers";
import Dropdown from "../common/Dropdown";

const MenuModeration = ({
  selectedMember,
}: {
  selectedMember: getMemberProps;
}) => {
  const { loadMembers } = useMembers();

  // En MenuModeration.tsx
const handleToggleBlock = async (action: string) => {
  const userService = new UserService();
  await userService.updateBlockUser(selectedMember.username, action);
  
  // Recargar miembros para actualizar el estado de bloqueo
  await loadMembers("rolePriority", "asc", true);
};

  return (
    <Dropdown transform="translate3d(0px, 35px, 0)">
      <li role="menuitem">
        {selectedMember?.role.name === "Bloqueado" ? (
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Desbloquear"
            width="100%"
            color="var(--text-base)"
            justifyContent="start"
            hoverStyleType={ButtonHoverStyle.NORMAL}
            onClick={() => handleToggleBlock("desbloquear")}
          />
        ) : (
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Bloquear"
            width="100%"
            justifyContent="start"
            color="var(--text-base)"
            hoverStyleType={ButtonHoverStyle.NORMAL}
            onClick={() => handleToggleBlock("bloquear")}
          />
        )}
      </li>
      <li role="menuitem">
        <Button
          styleType={ButtonStyle.TEXT_ONLY}
          label="Banear"
          justifyContent="start"
          width="100%"
          color="var(--essential-negative)"
          hoverStyleType={ButtonHoverStyle.NORMAL}
        />
      </li>
    </Dropdown>
  );
};

export default MenuModeration;

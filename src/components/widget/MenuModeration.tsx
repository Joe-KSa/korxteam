import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";
import type { getMemberProps } from "@/core/types";
import { UserService } from "../../core/services/user/userService";
import { useUser } from "@/hooks/useUser";
import Dropdown from "../common/Dropdown";

const MenuModeration = ({
  selectedMember,
}: {
  selectedMember: getMemberProps;
}) => {
  const { user } = useUser();

  const handleBlockUser = async () => {
    const userService = new UserService();
    await userService.blockUser(selectedMember.username);
  };

  const handleUnblockUser = async () => {
    const userService = new UserService();
    await userService.unblockUser(selectedMember.username);
  };

  return (
    <Dropdown transform="translate3d(0px, 35px, 0)">
      <li role="menuitem">
        {user?.writeAccess === 0 ? (
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Desbloquear"
            width="100%"
            color="var(--text-base)"
            justifyContent="start"
            hoverStyleType={ButtonHoverStyle.NORMAL}
            onClick={handleUnblockUser}
          />
        ) : (
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Bloquear"
            width="100%"
            justifyContent="start"
            color="var(--text-base)"
            hoverStyleType={ButtonHoverStyle.NORMAL}
            onClick={handleBlockUser}
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

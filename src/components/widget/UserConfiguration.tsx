import styles from "./styles/UserConfiguration.module.scss";
import Button, {
  ButtonStyle,
  ButtonHoverStyle,
  ButtonDirection,
} from "../common/Button";
import { RedirectIcon } from "@/assets/icons";
import { TokenManager } from "../../core/services/token/tokenService";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
// import { useMemberByUsername } from "@/hooks/useMemberByUsername";

const UserConfiguration = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  // const member = useMemberByUsername(user?.username);

  const handleLogout = () => {
    TokenManager.logout();
    console.log("Cerrando sesión...");
  };

  const handleSettingsRedirect = async () => {
    try {
      if (user) {
        navigate("/profile");
      } else {
        console.error("No se pudo obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
    }
  };

  return (
    <div className={styles.container}>
      <div id="context-menu">
        <div className={styles.container__inner}>
          <ul role="menu">
            {/* {member?.role.name === "Moderador" && (
              <li role="menuitem">
                <Button
                  label="Administracion"
                  styleType={ButtonStyle.TEXT_ONLY}
                  hoverStyleType={ButtonHoverStyle.NORMAL}
                  width="100%"
                  justifyContent="start"
                  onClick={() => navigate("/moderation")}
                />
              </li>
            )} */}
            <li role="menuitem">
              <Button
                label="Perfil"
                styleType={ButtonStyle.ICON_TEXT}
                hoverStyleType={ButtonHoverStyle.NORMAL}
                width="100%"
                justifyContent="space-between"
                flexDirection={ButtonDirection.REVERSE}
                onClick={handleSettingsRedirect}
              >
                <RedirectIcon className={"medium-icon"} />
              </Button>
            </li>
            <li>
              <Button
                label="Cerrar Sesión"
                styleType={ButtonStyle.TEXT_ONLY}
                hoverStyleType={ButtonHoverStyle.NORMAL}
                width="100%"
                justifyContent="start"
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserConfiguration;

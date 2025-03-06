import Button, {
  ButtonStyle,
  ButtonHoverStyle,
  ButtonDirection,
} from "../common/Button";
import { RedirectIcon } from "@/assets/icons";
import { TokenManager } from "../../core/services/token/tokenService";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useProjects } from "@/hooks/useProjects";
import Dropdown from "../common/Dropdown";

const UserConfiguration = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setShowComments } = useProjects();

  const handleLogout = () => {
    TokenManager.logout();
    console.log("Cerrando sesión...");
  };

  const handleSettingsRedirect = async () => {
    try {
      if (user) {
        setShowComments(false)
        navigate("/profile");

      } else {
        console.error("No se pudo obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
    }
  };

  return (
    <Dropdown transform="translate3d(-8px, 64px, 0px)">
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
          label="Mis proyectos"
          styleType={ButtonStyle.TEXT_ONLY}
          hoverStyleType={ButtonHoverStyle.NORMAL}
          width="100%"
          justifyContent="start"
          redirect
          href={`/projects/${user?.username}`}
        />
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
    </Dropdown>
  );
};

export default UserConfiguration;

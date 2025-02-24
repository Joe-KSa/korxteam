import styles from "./styles/OffCanvas.module.scss";
import Button, { ButtonHoverStyle, ButtonStyle } from "./Button";
import { HomeIcon, ProjectIcon } from "@/assets/icons";
import stylesNavbar from "../layout/header/styles/Navbar.module.scss";
import { LinesHorizontalIcon } from "@/assets/icons";
import image from "@/assets/KorxteamIcon.png";
import { useMembers } from "@/hooks/useMembers";

interface OffCanvasProps {
  open: boolean;
  setIsOpen: (value: boolean) => void;
}
const OffCanvas: React.FC<OffCanvasProps> = ({ open, setIsOpen }) => {
  const { setSelectedMember } = useMembers();

  return (
    <>
      <div className={`${styles.container} ${open ? styles.visible : ""}`}>
        <div className={styles.container__logo}>
          <Button
            styleType={ButtonStyle.ICON}
            padding="8px"
            onClick={() => setIsOpen(false)}
          >
            <LinesHorizontalIcon className="medium-icon" />
          </Button>

          <div className={stylesNavbar.containerLogo__inner}>
            <div
              className={stylesNavbar.containerLogo__inner__icon}
              title="home"
            >
              <img src={image} alt="" />
            </div>
          </div>
        </div>

        <div className={styles.container__inner}>
          <div className={styles.container__inner__content}>
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Principal"
              hoverStyleType={ButtonHoverStyle.NORMAL}
              width="100%"
              justifyContent="start"
              borderRadius="4px"
              href="/"
              onClick={() => setSelectedMember(null)}
              redirect
              iconMargin="0 5px 0 0"
            >
              <HomeIcon className="medium-icon" />
            </Button>
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Proyectos"
              hoverStyleType={ButtonHoverStyle.NORMAL}
              width="100%"
              justifyContent="start"
              borderRadius="4px"
              redirect
              onClick={() => setSelectedMember(null)}
              href="/projects"
              iconMargin="0 5px 0 0"
            >
              <ProjectIcon className="medium-icon" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffCanvas;

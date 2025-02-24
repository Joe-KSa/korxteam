import { useState, useRef, useEffect } from "react";
import styles from "./styles/Navbar.module.scss";
import { Search } from "@/components/widget/Search";
import Button, {
  ButtonStyle,
  ButtonHoverStyle,
} from "@/components/common/Button";
import {
  DiscordIcon,
  PlusIcon,
  LinesHorizontalIcon,
  NotificationIcon,
  ModerationIcon,
} from "@/assets/icons";
import image from "@/assets/KorxteamIcon.png";
import { useUser } from "@/hooks/useUser";
import useClickOutside from "@/hooks/useClickOutside";
import { environment } from "@/environments/environment.prod";
import UserConfiguration from "@/components/widget/UserConfiguration";
import OffCanvas from "@/components/common/OffCanvas";
import DrowpdownAddElement from "@/components/widget/DrowpdownAddElement";
import { useLocation } from "react-router-dom";
import DrowpdownModeration from "@/components/widget/DropdownModeration";

const Navbar = () => {
  const [isOpenOffCanvas, setIsOpenOffCanvas] = useState(false);
  const [isOpenUserConfig, setIsOpenUserConfig] = useState(false);
  const [isOpenAddElement, setIsOpenAddElement] = useState(false);
  const [isOpenModeration, setIsOpenModeration] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { user } = useUser();

  const selectBoxRefConfig = useRef<HTMLDivElement>(null);
  const selectBoxRefOffCanvas = useRef<HTMLDivElement>(null);
  const selectBoxRefAdd = useRef<HTMLDivElement>(null);
  const selectBoxNotification = useRef<HTMLDivElement>(null);
  const selectBoxRefModeration = useRef<HTMLDivElement>(null);

  useClickOutside(selectBoxRefConfig, () => setIsOpenUserConfig(false));
  useClickOutside(selectBoxRefOffCanvas, () => setIsOpenOffCanvas(false));
  useClickOutside(selectBoxRefAdd, () => setIsOpenAddElement(false));
  useClickOutside(selectBoxRefModeration, () => setIsOpenModeration(false));

  const location = useLocation();

  useEffect(() => {
    setIsOpenUserConfig(false);
    setIsOpenOffCanvas(false);
    setIsOpenAddElement(false);
    setIsOpenModeration(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setSearchExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!searchExpanded && (
        <div className={styles.containerLogo}>
          <div
            ref={selectBoxRefOffCanvas}
            className={styles.containerLogo__offCanvas}
          >
            <Button
              styleType={ButtonStyle.ICON}
              padding="8px"
              onClick={() => setIsOpenOffCanvas(!isOpenOffCanvas)}
            >
              <LinesHorizontalIcon className="medium-icon" />
            </Button>
            <OffCanvas open={isOpenOffCanvas} setIsOpen={setIsOpenOffCanvas} />
          </div>

          <div className={styles.containerLogo__inner}>
            <div className={styles.containerLogo__inner__icon}>
              <img src={image} alt="" />
            </div>
          </div>
        </div>
      )}

      <Search
        setSearchExpanded={setSearchExpanded}
        searchExpanded={searchExpanded}
      />

      {!searchExpanded && (
        <div className={styles.containerButtons}>
          <Button
            styleType={ButtonStyle.ICON_TEXT}
            hoverStyleType={ButtonHoverStyle.SCALE}
            redirect
            iconMargin="0 5px 0 0"
            label="Discord"
            hideLabelOnSmallScreen
            padding="8px"
            borderRadius="4px"
            href="https://discord.com/invite/fhjm8rJAf5"
          >
            <DiscordIcon className="medium-icon" />
          </Button>
          {user ? (
            <>
              <div ref={selectBoxRefAdd}>
                <Button
                  styleType={ButtonStyle.ICON}
                  label="Crear"
                  borderRadius="4px"
                  padding="4px 10px"
                  backgroundColor="var(--background-elevated-base)"
                  iconMargin="0 5px 0 0"
                  onClick={() => setIsOpenAddElement(!isOpenAddElement)}
                >
                  <PlusIcon className="medium-icon" />
                </Button>
                {isOpenAddElement && <DrowpdownAddElement />}
              </div>
              <div ref={selectBoxNotification}>
                <Button
                  styleType={ButtonStyle.ICON}
                  hoverStyleType={ButtonHoverStyle.SCALE}
                  padding="4px"
                  redirect
                  href="/notification"
                >
                  <NotificationIcon className="medium-icon" />
                </Button>
              </div>
              {user.role.name === "Moderator" ||
                (user.role.name === "Administrador" && (
                  <div ref={selectBoxRefModeration}>
                    <Button
                      styleType={ButtonStyle.ICON}
                      hoverStyleType={ButtonHoverStyle.SCALE}
                      padding="4px"
                      redirect
                      onClick={() => setIsOpenModeration(!isOpenModeration)}
                    >
                      <ModerationIcon className="large-icon" />
                    </Button>
                    {isOpenModeration && <DrowpdownModeration />}
                  </div>
                ))}

              <div ref={selectBoxRefConfig}>
                <Button
                  styleType={ButtonStyle.ICON}
                  backgroundColor="var(--background-elevated-base)"
                  borderRadius="50%"
                  padding="4px"
                  onClick={() => setIsOpenUserConfig(!isOpenUserConfig)}
                >
                  <figure className={styles.userContainer}>
                    <div className={styles.userContainer__inner}>
                      <img src={user.image} alt="" />
                    </div>
                  </figure>
                </Button>
                {isOpenUserConfig && <UserConfiguration />}
              </div>
            </>
          ) : (
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Sign Up"
              color="#000"
              hoverStyleType={ButtonHoverStyle.SCALE}
              redirect
              href={`${environment.backEnd.baseUrl}/auth/discord/login`}
              backgroundColor="#fff"
              borderRadius="10px"
              padding="5px 10px"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;

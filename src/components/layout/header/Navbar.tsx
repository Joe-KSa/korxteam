import { useState, useRef } from "react";
import styles from "./styles/Navbar.module.scss";
import { Search } from "@/components/widget/Search";
import Button, {
  ButtonStyle,
  ButtonHoverStyle,
} from "@/components/common/Button";
import { DiscordIcon } from "@/assets/icons";
import image from "@/assets/KorxteamIcon.png";
import { useUser } from "@/hooks/useUser";
import useClickOutside from "@/hooks/useClickOutside";
import { environment } from "@/environments/environment.prod";
import UserConfiguration from "@/components/widget/UserConfiguration";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const selectBoxRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectBoxRef, () => setIsOpen(false))

  return (
    <>
      <div className={styles.containerLogo}>
        <div className={styles.containerLogo__icon} title="home">
          <img src={image} alt="" />
        </div>
      </div>
      <Search />
      <div className={styles.containerButtons}>
        <Button
          styleType={ButtonStyle.ICON_TEXT}
          label="Discord"
          iconMargin="0 5px 0 0"
          hoverStyleType={ButtonHoverStyle.SCALE}
          redirect
          hideLabelOnSmallScreen
          href="https://discord.com/invite/fhjm8rJAf5"
        >
          <DiscordIcon className="medium-icon" />
        </Button>
        {user ? (
          <div ref={selectBoxRef}>
            <Button
              styleType={ButtonStyle.ICON}
              backgroundColor="var(--background-elevated-base)"
              borderRadius="50%"
              padding="4px"
              onClick={() => setIsOpen(!isOpen)}
            >
              <figure className={styles.userContainer}>
                <div className={styles.userContainer__inner}>
                  <img src={user.image} alt="" />
                </div>
              </figure>
            </Button>
            {isOpen && <UserConfiguration />}
          </div>
        ) : (
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Sing Up"
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
    </>
  );
};

export default Navbar;

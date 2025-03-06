import { useState, useRef, useEffect, useMemo } from "react";
import SkillTags from "./SkillTags";
import Button, { ButtonStyle } from "../common/Button";
import { GithubIcon, DeleteIcon, MoreIcon } from "@/assets/icons";
import { formatDate } from "@/utils/formatDate";
import { useMembers } from "@/hooks/useMembers";
import styles from "./styles/MemberProfile.module.scss";
import icono from "@/assets/icon.ico";
import HeaderProfile from "../ui/HeaderProfile";
import { useUser } from "@/hooks/useUser";
import useClickOutside from "@/hooks/useClickOutside";
import MenuModeration from "./MenuModeration";
import { useLocation } from "react-router-dom";
import { useRoleStore } from "@/store/useRoleStore";

interface memberProfileProps {
  width: number;
}

const MemberProfile: React.FC<memberProfileProps> = ({ width }) => {
  const { setSelectedMember, selectedMember } = useMembers();
  const { user } = useUser();
  const location = useLocation();
  const { fetchUserRoles, hasPermission, permissions } = useRoleStore();

  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectBoxRef, () => setIsOpen(false));

  // Ocultar en móviles cuando la ruta es /settings
  const name = selectedMember?.name ?? "Usuario desconocido";
  const username = selectedMember?.username ?? "Desconocido";
  const description = selectedMember?.description ?? "";
  const tags = selectedMember?.tags ?? [];
  const createdAt = selectedMember?.createdAt ?? "";
  const github = selectedMember?.github ?? "#";
  const primaryColor = selectedMember?.primaryColor;
  const secondaryColor = selectedMember?.secondaryColor;
  const soundUrl = selectedMember?.sound.url;

  const tagNames = (tags ?? []).map((tag) => tag.name);
  const formattedDate = formatDate(createdAt);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (user) fetchUserRoles(user?.id);
  }, [user?.id, fetchUserRoles]);

  const canModerateUsers = useMemo(() => {
    return hasPermission("moderate:users");
  }, [permissions]); // Solo se recalcula cuando "permissions" cambian

  useEffect(() => {
    // Evitar reproducción si estamos en una ruta diferente a dashboard
    if (location.pathname !== "/") return;

    // Detener el audio anterior si existe
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedMember]);

  return (
    <>
      <div
        className={`${styles.container} ${
          primaryColor || secondaryColor ? styles.container__gradient : ""
        }`}
        style={
          {
            width: `${width}px`,
            maxWidth: `${width}px`,
            "--profile-gradient-primary-color": primaryColor,
            "--profile-gradient-secondary-color": secondaryColor,
          } as React.CSSProperties
        }
      >
        <div className={styles.container__actions}>
          <div
            className={styles.container__actions__icon}
            onClick={() => setSelectedMember(null)}
          >
            <DeleteIcon className={"large-icon"} />
          </div>
          {canModerateUsers && (
            <div ref={selectBoxRef} onClick={() => setIsOpen(!isOpen)}>
              <div className={styles.container__actions__icon}>
                <MoreIcon className={"large-icon"} />
              </div>
              {isOpen && selectedMember && (
                <MenuModeration selectedMember={selectedMember} />
              )}
            </div>
          )}
        </div>
        <HeaderProfile maskId={"memberId"} primaryColor={primaryColor || ""} />
        <div className={styles.body}>
          <div className={styles.body__info}>
            <div className={styles.body__info__wrapper}>
              <div className={styles.body__info__wrapper__name}>
                <span>{name}</span>
              </div>
              <div className={styles.memberData}>
                <div className={styles.memberData__username}>
                  <span>@{username}</span>
                </div>
              </div>
            </div>

            {description.trim() && (
              <div className={styles.body__info__description}>
                <span>{description}</span>
              </div>
            )}
          </div>
          {tagNames.length > 0 && (
            <div className={styles.body__languages}>
              <h1>Tecnologias</h1>
              <SkillTags tags={tagNames} activeGradient />
            </div>
          )}
          <div className={styles.body__date}>
            <h1>Miembro desde</h1>
            <div className={styles.date}>
              <img src={icono} alt="korxteam" style={{ height: "14px" }} draggable={false}/>
              <span>{formattedDate}</span>
            </div>
          </div>
          {selectedMember?.github && (
            <div className={styles.body__socials}>
              <h1>Conexiones</h1>
              <div style={{ marginTop: "1rem" }}>
                <Button
                  backgroundColor="var(--decorative-subdued)"
                  styleType={ButtonStyle.ICON_TEXT}
                  label="Github"
                  href={github}
                  redirect
                  iconMargin="0 5px 0 0"
                  borderRadius="4px"
                  padding="10px 20px"
                  openInNewTab
                  border={
                    !!(
                      selectedMember?.primaryColor ||
                      selectedMember?.secondaryColor
                    )
                  }
                >
                  <GithubIcon className={"small-icon"} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberProfile;

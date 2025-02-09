import { useState, useRef } from "react";
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
import { useModeratorById } from "@/hooks/useModeratorById";

interface memberProfileProps {
  width: number;
}

const MemberProfile: React.FC<memberProfileProps> = ({ width }) => {
  const { setSelectedMember, selectedMember } = useMembers();
  const { user } = useUser();
  const { moderator } = useModeratorById(user?.id)

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

  const tagNames = (tags ?? []).map((tag) => tag.name);
  const formattedDate = formatDate(createdAt);

  return (
    <>
      <div
        className={styles.container}
        style={{ width: `${width}px`, maxWidth: `${width}px` }}
      >
        <div className={styles.container__actions}>
          <div
            className={styles.container__actions__icon}
            onClick={() => setSelectedMember(null)}
          >
            <DeleteIcon className={"large-icon"} />
          </div>
          {moderator?.role.name === "Moderador" && (
            <div ref={selectBoxRef} onClick={() => setIsOpen(!isOpen)}>
              <div className={styles.container__actions__icon}>
                <MoreIcon className={"large-icon"} />
              </div>
              {isOpen &&  selectedMember && <MenuModeration selectedMember={selectedMember}/>}
            </div>
          )}
        </div>
        <HeaderProfile maskId={"memberId"} />
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

            {description && (
              <div className={styles.body__info__description}>
                <span>{description}</span>
              </div>
            )}
          </div>
          {tagNames.length > 0 && (
            <div className={styles.body__languages}>
              <h1>Lenguajes</h1>
              <SkillTags tags={tagNames} />
            </div>
          )}
          <div className={styles.body__date}>
            <h1>Miembro desde</h1>
            <div className={styles.date}>
              <img src={icono} alt="korxteam" style={{ height: "14px" }} />
              <span>{formattedDate}</span>
            </div>
          </div>
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
              >
                <GithubIcon className={"small-icon"} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberProfile;

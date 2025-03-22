import React, { useCallback } from "react";
import { useMembers } from "@/hooks/useMembers";
import { useProjects } from "@/hooks/useProjects";
import styles from "./styles/TableMember.module.scss";
import image from "@/assets/LoadingMembers.gif";
import { getMemberProps } from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { RemoveIcon } from "@/assets/icons";
import { Badges } from "./MemberProfile";
import DiscordLogo from "@/assets/DiscordLogo.jpg"

type TableMembersProps = {
  isOverviewSectionVisible?: boolean;
  selectedMemberIds?: number[];
  creatorId?: number;
  onRemoveMember?: (memberId: number) => void;
};

const TableMembers: React.FC<TableMembersProps> = ({
  isOverviewSectionVisible,
  selectedMemberIds = [],
  creatorId,
  onRemoveMember,
}) => {
  const { members, hiddenMembers, setSelectedMember } = useMembers();

  const { user } = useUser();
  const {
    selectedProject,
    projectDominantColor,
    setShowComments,
  } = useProjects();

  const isModerationPage = location.pathname.startsWith("/moderation/members");
  const isManagingProject =
    location.pathname.startsWith("/new-project") ||
    location.pathname.startsWith(`/project/${selectedProject?.id}/edit`);

  const handleUserClick = useCallback(
    (user: getMemberProps) => {
      setSelectedMember(user);
      setShowComments(false);
    },
    [setSelectedMember]
  );

  let currentMembers = isModerationPage
    ? hiddenMembers
    : selectedProject
    ? selectedProject.members
    : members;

  if (!currentMembers) return;

  if (isManagingProject) {
    currentMembers = members.filter(
      (member) => selectedMemberIds.includes(member.id) && !member.hidden
    );
  }

  return (
    <>
      <div
        className={styles.mask}
        style={{
          backgroundColor: isModerationPage
            ? "transparent"
            : projectDominantColor || "transparent",
        }}
      ></div>
      <div className={styles.table}>
        <div
          className={`${styles.table__headerContainer} ${
            isOverviewSectionVisible ? styles.desactive : styles.active
          }`}
        >
          <div
            className={`${styles.header} ${
              isOverviewSectionVisible ? styles.header__border : ""
            }`}
          >
            <div className={styles.header__item} style={{ textAlign: "end" }}>
              #
            </div>
            <div className={styles.header__item}>Nombre</div>
            <div
              className={`${styles.header__item} ${
                isManagingProject ? styles.isManagingProject__header : ""
              }`}
            >
              Rol
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {currentMembers.length === 0 ? (
            <div className="no-items-message" style={{ marginTop: "4em" }}>
              <div className="no-items-container">
                <img src={image} alt="MemberGif" />
                <span>Buscando miembros</span>
              </div>
            </div>
          ) : (
            currentMembers.map((member, index) => {
              const isCreator = String(member.userId) === String(creatorId);
              const isCurrentUser = String(member.userId) === String(user?.id);

              const displayRole = isCreator ? "Creador" : member.role.name;

              return (
                <div role="row" aria-rowindex={index + 2} key={member.id}>
                  <div
                    className={styles.body__row}
                    onClick={() => handleUserClick(member)}
                  >
                    <div
                      aria-colindex={1}
                      className={`${styles.body__row__item} ${styles.body__row__item__index}`}
                    >
                      <div>
                        <span>{index + 1}</span>
                      </div>
                    </div>

                    <div
                      aria-colindex={2}
                      className={`${styles.body__row__item} ${styles.body__row__item__member}`}
                    >
                      <img
                        className={styles.body__row__item__member__image}
                        src={member?.images?.avatar?.url}
                        alt={member.name}
                        draggable={false}
                        onError={(e) => {
                            e.currentTarget.src = DiscordLogo
                            e.currentTarget.onerror = null;
                        }}
                      />
                      <div className={styles.body__row__item__member__wrapper}>
                        <div
                          className={
                            styles.body__row__item__member__wrapper__name
                          }
                        >
                          {member.name}
                        </div>
                        {(member.projectsCount >= 1 ||
                          member.tags.length === 10 ||
                          member.collaborationsCount >= 1 ||
                          member.projectsCount >= 3 ||
                          member.commentsCount >= 10) && (
                          <Badges selectedMember={member} />
                        )}
                      </div>
                    </div>

                    <div
                      aria-colindex={3}
                      className={`${styles.body__row__item} ${styles.body__row__item__role}`}
                      style={{
                        justifyContent: isManagingProject
                          ? "space-between"
                          : "",
                      }}
                    >
                      {displayRole}
                      {isManagingProject && !isCreator && !isCurrentUser && (
                        <div
                          className={styles.body__row__item__remove}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveMember && onRemoveMember(member.id);
                          }}
                        >
                          <RemoveIcon />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default TableMembers;

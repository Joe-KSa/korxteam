import { useState, useEffect } from "react";
import { getMemberProps } from "@/core/types";
import styles from "@/components/widget/styles/MemberProfile.module.scss";
import { MemberService } from "@/core/services/member/memberService";
import useDominantColor from "@/hooks/useDominantColor";
import { useUser } from "@/hooks/useUser";
import { useMembers } from "@/hooks/useMembers";
import { useImageStore } from "@/store/store";
import { PencilIcon } from "@/assets/icons";
import { getTextColor } from "@/utils/CheckColor";
import { hexToRgb } from "@/utils/CheckColor";
import DiscordLogo from "@/assets/DiscordLogo.jpg"

const HeaderProfile = ({
  maskId,
  primaryColor,
}: {
  maskId: string;
  primaryColor?: string;
}) => {
  const { user } = useUser();
  const { setSelectedMember, selectedMember } = useMembers();
  const { images, setImage } = useImageStore();

  const [currentUser, setCurrentUser] = useState<getMemberProps | null>(null);
  const isCurrentUser = user?.username === selectedMember?.username;
  const isSettingsPage = window.location.pathname === "/profile";

  const profile =
    isSettingsPage && isCurrentUser
      ? images.imageUrl || selectedMember?.images.avatar.url
      : currentUser?.images.avatar.url || selectedMember?.images.avatar.url;

  const banner =
    isSettingsPage && isCurrentUser
      ? images.bannerUrl || selectedMember?.images.banner.url
      : currentUser?.images.banner.url || selectedMember?.images.banner.url;

  const dominantColor = useDominantColor(profile || "");

  const isMobile = window.innerWidth <= 767;

  const isDisabled = !isSettingsPage || user?.role.name === "Bloqueado";

  useEffect(() => {
    if (user && !selectedMember) {
      const fetchCurrentUser = async () => {
        const fetchedUser = await new MemberService().getMemberByUsername(
          user.username
        );
        setCurrentUser(fetchedUser || null);
      };
      fetchCurrentUser();
    }
  }, [user, selectedMember]);

  const handleImageChange = (field: "image" | "banner", file: File) => {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      alert(`El archivo supera el límite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    if (isDisabled) return;

    const url = URL.createObjectURL(file);
    setImage(field, file);

    if (selectedMember) {
      const updatedMember = {
        ...selectedMember,
        [field]: url,
      };
      setSelectedMember(updatedMember);
    }
  };

  const handleImageClick = (field: "image" | "banner") => {
    if (isDisabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageChange(field, file);
      }
    };
    input.click();
  };

  const rgbColor = hexToRgb(primaryColor);
  const phraseColor = rgbColor
    ? getTextColor(`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`)
    : "#fff";

  return (
    <header className={styles.header}>
      <svg className={styles.header__bannerContainer}>
        <defs>
          <mask id={maskId}>
            <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
            <circle fill="black" cx="52" cy="97" r="46">
              dasdasd
            </circle>
          </mask>
        </defs>
        <foreignObject
          x="0"
          y="0"
          width="100%"
          height="100%"
          overflow="visible"
          mask={`url(#${maskId})`}
        >
          <div
            className={`${styles.header__bannerContainer__banner} ${
              isSettingsPage && (isCurrentUser || isMobile)
                ? styles.selectedFile
                : ""
            }`}
            onClick={() => handleImageClick("banner")}
            style={{
              backgroundColor: banner ? "transparent" : dominantColor || "",
              backgroundImage: banner ? `url(${banner})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Hover */}
            {isSettingsPage && (isCurrentUser || isMobile) && (
              <div
                className={styles.header__bannerContainer__banner__fileEditable}
              >
                <span>Cambiar Banner</span>
              </div>
            )}
          </div>
        </foreignObject>
      </svg>

      <div className={styles.header__imageContainer}>
        <div
          className={`${styles.header__imageContainer__image} ${
            isSettingsPage && (isCurrentUser || isMobile)
              ? styles.selectedFile
              : ""
          }`}
          onClick={() => handleImageClick("image")}
        >
          <img src={profile || DiscordLogo} draggable={false} onError={(e) => {
                            e.currentTarget.src = DiscordLogo
                            e.currentTarget.onerror = null;
                        }}/>
          {isSettingsPage && (isCurrentUser || isMobile) && (
            <div className={styles.header__imageContainer__image__fileEditable}>
              <PencilIcon className={"medium-icon"} />
            </div>
          )}
        </div>
      </div>

      {selectedMember?.phrase && (
        <div
          className={styles.header__phraseContainer}
          style={
            {
              "--custom-status-bubble-background-color": primaryColor,
              "--border-faint": primaryColor,
              "--text-color": phraseColor,
            } as React.CSSProperties
          }
        >
          <div className={styles.header__phraseContainer__inner}>
            <span className={styles.header__phraseContainer__inner__wrapper}>
              <div className={styles.phraseContent}>
                {selectedMember?.phrase}
              </div>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderProfile;

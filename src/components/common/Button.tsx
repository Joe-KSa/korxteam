import React from "react";
import styles from "./styles/Button.module.scss";
import { Link } from "react-router-dom";

export enum ButtonStyle {
  ICON = "icon",
  ICON_TEXT = "icon-text",
  TEXT_ONLY = "text-only",
}

export enum ButtonHoverStyle {
  NORMAL = "hover",
  SCALE = "scaleHover",
  DISABLED = "disabledhover",
}

export enum ButtonDirection {
  REVERSE = "row-reverse",
  NORMAL = "row",
}

interface ButtonProps {
  label?: string;
  backgroundColor?: string;
  fontSize?: string;
  children?: React.ReactNode;
  styleType: ButtonStyle;
  onClick?: () => void;
  disabled?: boolean;
  borderRadius?: string;
  padding?: string;
  color?: string;
  hoverStyleType?: ButtonHoverStyle;
  redirect?: boolean;
  href?: string;
  margin?: string;
  iconMargin?: string;
  flexDirection?: ButtonDirection;
  width?: string;
  justifyContent?: string;
  border?: boolean;
  hideLabelOnSmallScreen?: boolean;
  height?: string;
  type?: "button" | "reset" | "submit";
}

const Button: React.FC<ButtonProps> = ({
  label = "",
  backgroundColor = "",
  styleType,
  children,
  onClick,
  fontSize = "",
  disabled = false,
  borderRadius = "",
  padding = "",
  color = "",
  hoverStyleType,
  redirect = false,
  margin = "",
  iconMargin = "",
  href = "#",
  flexDirection,
  width = "",
  justifyContent,
  border = false,
  height = "",
  type = "button",
  hideLabelOnSmallScreen = false,
}) => {
  const buttonClasses = [
    styles.buttonCommon || "",
    (disabled && styles.buttonDisabled) || "",
    (border && styles.buttonBorder) || "",
    (hoverStyleType && styles[hoverStyleType]) || "",
    (hideLabelOnSmallScreen && styles.hideLabelOnSmallScreen) || "",
    styles[styleType],
  ]
    .filter(Boolean)
    .join(" ");

  const contentClasses = `${styles.buttonContent} ${styles[styleType]} `;

  const commonProps = {
    className: buttonClasses,
    style: {
      backgroundColor: border ? "transparent" : backgroundColor,
      fontSize,
      padding,
      color,
      margin,
      borderRadius,
      width,
      height,
    },
    "aria-disabled": disabled,
    "aria-label": label || "Botón de acción",
    onClick: disabled ? undefined : onClick,
    role: redirect ? "button" : "",
  };

  const renderContent = () => (
    <div className={contentClasses} style={{ flexDirection, justifyContent }}>
      {children && (
        <span className={styles.buttonIcon} style={{ margin: iconMargin }}>
          {children}
        </span>
      )}
      {label && <span className={styles.buttonLabel}>{label}</span>}
    </div>
  );

  return redirect ? (
    <Link
      to={disabled ? "#" : href}
      {...commonProps}
      tabIndex={disabled ? -1 : 0}
    >
      {renderContent()}
    </Link>
  ) : (
    <button {...commonProps} type={type} disabled={disabled}>
      {renderContent()}
    </button>
  );
};

export default React.memo(Button);

import React, { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { CloseButton } from "./CloseButton";
import styles from "./styles/Modal.module.scss";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  return (
    <div className={styles.container}>
      <div className={styles.container__inner} ref={modalRef}>
        <CloseButton handleClose={onClose} />
        <div className={styles.container__inner__content}>{children}</div>
      </div>
    </div>
  );
};

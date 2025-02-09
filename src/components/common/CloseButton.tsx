import { DeleteIcon } from "@/assets/icons";
import styles from "./styles/CloseButton.module.scss"

interface CloseButton {
  handleClose: () => void;
}

export const CloseButton: React.FC<CloseButton> = ({ handleClose }) => (
  <div className={styles.container}>
    <div className={styles.container__icon} onClick={handleClose}>
      <DeleteIcon className={'medium-icon'}/>
    </div>
  </div>
);

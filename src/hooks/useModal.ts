import { useState, useCallback } from "react";

const useModal = () => {
  const [modals, setModals] = useState<{ [key: string]: boolean }>({});

  const handleModalToggle = useCallback((modalName: string) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: !prevModals[modalName],
    }));
  }, []);

  return { modals, handleModalToggle };
};

export default useModal;

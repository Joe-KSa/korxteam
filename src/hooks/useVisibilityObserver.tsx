import { useEffect, useState } from "react";

function useVisibilityObserver(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.01 }
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }, 500); // Espera 0.5 segundos

    // Limpiar timeout si ref no es encontrado al principio
    return () => clearTimeout(timeoutId);

  }, [ref.current]);

  return isVisible;
}

export default useVisibilityObserver;

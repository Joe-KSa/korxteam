import React, { useState, useRef, useEffect } from "react";
import "./styles/ResizeBar.css";

const ResizeBar = ({ onResize }: { onResize: (width: number) => void }) => {
  const [width, setWidth] = useState(300); // Ancho inicial del contenedor
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0); // Posición inicial del mouse
  const startWidth = useRef(0); // Ancho inicial del contenedor

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX; // Guardar la posición inicial del mouse
    startWidth.current = width; // Guardar el ancho inicial
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // Calcular la diferencia de movimiento entre el mouse y el punto de inicio
      const diff = startX.current - e.clientX; // Invertir la dirección

      let newWidth = startWidth.current + diff;

      // Limitar el ancho entre 280 y 420
      newWidth = Math.min(420, Math.max(280, newWidth));

      // Actualizar el estado solo cuando el valor cambia
      if (newWidth !== width) {
        setWidth(newWidth);
        onResize(newWidth);
      }
    }
  };

  const handleResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    setWidth(newWidth);
    onResize(newWidth);
  };

  useEffect(() => {
    // Asegurarse de limpiar los eventos si el componente se desmonta
    const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMoveEvent);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mouseleave", handleMouseUp); // Detener el arrastre si el mouse sale de la ventana
    } else {
      window.removeEventListener("mousemove", handleMouseMoveEvent);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveEvent);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, width]);

  return (
    <div
      className="resize-bar-container"
      onMouseDown={handleMouseDown}
    >
      <div className="resize-bar" />
      <label className="hidden-visibility">
        Cambiar tamaño:
        <input
          id="resize-bar"
          className="resize-bar-slider"
          type="range"
          min="280"
          max="420"
          step="10"
          value={width}
          onChange={handleResize}
        />
      </label>
    </div>
  );
};

export default ResizeBar;

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
  
    // Obtener los componentes de la fecha
    const day = date.getDate();
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    // Formatear la fecha manualmente
    return `${day} ${month} ${year}`;
  };
  
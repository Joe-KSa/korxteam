import { useState, useEffect } from "react";

const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  return token;
};

export default useAuthToken;

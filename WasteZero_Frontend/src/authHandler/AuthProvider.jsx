import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

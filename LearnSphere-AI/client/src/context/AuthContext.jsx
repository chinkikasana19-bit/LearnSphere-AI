import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("learnsphere_user");
    return saved ? JSON.parse(saved) : null;
  });

  function saveAuth(data) {
    localStorage.setItem("learnsphere_token", data.token);
    localStorage.setItem("learnsphere_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("learnsphere_token");
    localStorage.removeItem("learnsphere_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, saveAuth, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("staysphere_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (nextUser) => {
    setUser(nextUser);

    if (nextUser?.token) {
      localStorage.setItem("staysphere_user", JSON.stringify(nextUser));
      localStorage.setItem("staysphere_token", nextUser.token);
    } else {
      localStorage.removeItem("staysphere_user");
      localStorage.removeItem("staysphere_token");
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await client.post("/auth/register", payload);
      persistUser(data.user);
      toast.success(data.message);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await client.post("/auth/login", payload);
      persistUser(data.user);
      toast.success(data.message);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persistUser(null);
    toast.success("Signed out");
  };

  const refreshProfile = async () => {
    if (!localStorage.getItem("staysphere_token")) {
      return;
    }

    try {
      const { data } = await client.get("/auth/me");
      setUser((current) => ({ ...current, ...data.user, token: current?.token }));
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      persistUser,
      register,
      login,
      logout,
      refreshProfile
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

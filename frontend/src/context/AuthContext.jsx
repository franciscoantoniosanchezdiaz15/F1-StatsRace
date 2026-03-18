import { createContext, useContext, useEffect, useState } from "react";
import {getCurrentUser, loginUser, logoutUser, registerUser} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const data = await getCurrentUser();

        if (data.authenticated) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    cargarUsuario();
  }, []);

  const login = async (usuario, contraseña) => {
    const data = await loginUser(usuario, contraseña);
    setUsuario(data.usuario);
    return data;
  };

  const register = async (usuario, contraseña) => {
    const data = await registerUser(usuario, contraseña);
    setUsuario(data.usuario);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!usuario, //devolver tru o false si el usuario esta logueado o no
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
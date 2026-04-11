import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth(mensaje = "Debes iniciar sesión para acceder") {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/home", { state: { errorAuth: mensaje } });
    }
  }, [isAuthenticated, loading]);

  return { loading, isAuthenticated };
}
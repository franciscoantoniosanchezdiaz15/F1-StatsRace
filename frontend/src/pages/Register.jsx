import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(usuario, contraseña);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="max-w-md bg-neutral-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Registro</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-white"
              placeholder="Elige un usuario"
            />
          </div>

          <div>
            <label className="block mb-2">Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full rounded-lg px-4 py-2 text-white"
              placeholder="Elige una contraseña"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-2 font-semibold"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-400 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
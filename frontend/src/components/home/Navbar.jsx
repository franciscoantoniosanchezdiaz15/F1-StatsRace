import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function Navbar() {

  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };
  
  return (
    <header className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#A6051A]">
        F1 StatsRace
      </h1>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button onClick={() => navigate("/home")} className="hover:text-[#A6051A] transition cursor-pointer">Inicio</button>
        <button className="hover:text-[#A6051A] transition cursor-pointer">Pilotos</button>
        <button className="hover:text-[#A6051A] transition cursor-pointer">Circuitos</button>
        <button className="hover:text-[#A6051A] transition cursor-pointer">Equipos</button>
        <button className="hover:text-[#A6051A] transition cursor-pointer">Duelo</button>
      </nav>

      

      <div className="flex items-center justify-center px-4 py-8">
        {usuario ? (
          <div className="flex items-center gap-3">
            <p className="bg-[#A6051A] text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-600 transition">Bienvenido {usuario.nombre}</p>
            <button onClick={handleLogout} className="border border-[#A6051A] text-[#A6051A] px-4 py-2 rounded-md font-semibold hover:bg-red-50 transition cursor-pointer">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/register")} className="bg-[#A6051A] text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-600 transition cursor-pointer">
              Registro
            </button>
            <button onClick={() => navigate("/login")} className="border border-[#A6051A] text-[#A6051A] px-4 py-2 rounded-md font-semibold hover:bg-red-50 transition cursor-pointer">
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
      
    </header>
  )
}

export default Navbar
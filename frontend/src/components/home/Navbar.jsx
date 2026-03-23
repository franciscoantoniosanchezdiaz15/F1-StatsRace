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
    <header className="sticky top-0 z-50 border-white/10 bg-black/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        
        <div onClick={() => navigate("/home")} className="flex items-center gap-2 cursor-pointer group">
          <div className="h-8 w-1 bg-[#A6051A] group-hover:h-10 transition-all duration-300"></div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            F1 <span className="text-[#A6051A]">Stats</span>Race
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => navigate("/home")} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-700 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">Inicio</button>
          <button onClick={() => navigate("/pilotos")} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-700 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">Pilotos</button>
          <button onClick={() => navigate("/circuitos")} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-700 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">Circuitos</button>
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-700 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">Equipos</button>
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-700 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">Duelo</button>
        </nav>

        

        <div className="flex items-center gap-4">
          {usuario ? (
            <div className="flex items-center gap-4">

              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Piloto Online</span>
              <span className="text-white font-bold italic">{usuario.nombre}</span>
              
              <button onClick={handleLogout} className="group relative px-6 py-2 overflow-hidden rounded-sm bg-transparent border border-[#A6051A] text-[#A6051A] text-xs font-black uppercase tracking-widest transition-all hover:text-white cursor-pointer">
                <div className="absolute inset-0 w-0 bg-[#A6051A] transition-all duration-300 group-hover:w-full -z-10"></div>
                Cerrar sesión
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/register")} className="text-xs font-black uppercase tracking-widest text-white hover:text-[#A6051A] transition cursor-pointer">
                Registro
              </button>
              <button onClick={() => navigate("/login")} className="text-xs font-black uppercase tracking-widest text-white hover:text-[#A6051A] transition cursor-pointer">
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div> 

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#A6051A] to-transparent opacity-50"></div>
    </header>
  )
}

export default Navbar
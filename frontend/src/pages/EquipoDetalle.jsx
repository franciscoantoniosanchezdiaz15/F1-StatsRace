import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchEquipoDetalle } from "../services/equipoService";
import { getEquipo } from "../utils/getEquipo";

export default function EquipoDetalle() {

  const { team_name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = location.state?.page || 1;

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEquipoDetalle(team_name);
        setEquipo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [team_name]);

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10 pt-10">

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando equipo...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && !error && equipo && (
          <article className="relative bg-neutral-900 rounded-tr-[50px] rounded-bl-[50px] border-l-4 border-t-4 border-neutral-700 shadow-2xl flex flex-col xl:flex-row items-stretch overflow-hidden animate-fade-in transition-all duration-300 ease-out">
            
            <div className="relative w-full xl:w-1/2 flex flex-col items-center justify-center p-8 z-10 border-b-4 border-[#0070FF] xl:border-b-0 xl:border-r-4">
              <div className="relative w-full  bg-[#00A3FF]/20 rounded-2xl border-4 border-[#0070FF] flex items-center justify-center p-6 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-950 opacity-40 z-0"></div>
              
                <img
                  src={getEquipo(equipo.team_name)}
                  alt={equipo.team_name}
                  className="max-w-[100%] max-h-[100%] object-contain drop-shadow-[0_0_15px_rgba(0,112,255,0.8)] z-10"
                />

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0070FF] shadow-[0_0_20px_#0070FF]"></div>
              </div>

            </div>

            <div className="w-full xl:w-1/2 p-12 flex flex-col justify-between z-10 relative">
              <header className="mb-10">
                <p className="text-[#FFEB00] font-mono tracking-widest uppercase text-sm mb-1">Official F1 Team Profile</p>
                <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-white">
                  {equipo.team_name}
                </h1>
                <div className="h-2 w-32 mt-4 bg-[#FFEB00] shadow-[0_0_15px_#FFEB00]"></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Posicion</p>
                  <p className="text-3xl font-extrabold text-neutral-100">{equipo.position_current}</p>
                </div>

                <div className="pt-6 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Puntos:</p>
                  <p className="text-5xl font-black text-[#FFEB00] italic">{equipo.points_current}</p>
                </div>
              </div>

              
            </div>
          </article>
        )}

      </section>

      <button
        onClick={() => navigate(`/equipos?page=${page}`)}
        className="mt-10 group flex items-center gap-3 px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-white/5">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
      </button>

    </div>
  );
}
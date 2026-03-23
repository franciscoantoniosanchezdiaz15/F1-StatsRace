import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchEquipoDetalle } from "../services/equipoService";
import { getEquipo } from "../utils/getEquipo";
import Daniel from "../assets/Daniel_Ricciardo.png";

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
          <article className="relative bg-neutral-900 rounded-tr-[80px] rounded-bl-[80px] border border-neutral-800 shadow-2xl flex flex-col xl:flex-row items-stretch overflow-hidden animate-fade-in group">

            <div className="relative w-full xl:w-5/12 flex flex-col items-center justify-center p-12 z-10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border-b-2 xl:border-b-0 xl:border-r-2 border-white/5">

             <div className="relative w-full max-w-sm aspect-square bg-[#00A3FF]/5 rounded-full border border-[#00A3FF]/20 flex items-center justify-center p-10 overflow-hidden shadow-[inner_0_0_50px_rgba(0,163,255,0.1)]">
                <div className="absolute inset-0 bg-[#00A3FF]/10 blur-3xl rounded-full"></div>
                <img
                  src={getEquipo(equipo.team_name)}
                  alt={equipo.team_name}
                  className="relative z-10 w-full object-contain drop-shadow-[0_10px_30px_rgba(0,163,255,0.5)] transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="mt-8 px-6 py-2 bg-black/50 border border-white/10 rounded-full">
                <p className="text-[#00A3FF] font-mono text-[10px] tracking-[0.4em] uppercase">Escuderia</p>
              </div>

            </div>
            
            <div className="w-full xl:w-7/12 p-8 md:p-14 flex flex-col justify-between relative bg-neutral-900/50">
              <div>
                <header className="mb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-[2px] w-10 bg-[#FFEB00]"></div>
                    <p className="text-[#FFEB00] font-mono tracking-[0.3em] uppercase text-xs font-bold">Perfil Escuderia v2.0</p>
                  </div>
                  <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-white drop-shadow-md">
                    {equipo.team_name}
                  </h1>
                </header>

                <div className="grid grid-cols-2 gap-8 mb-16">
                  <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-neutral-700">
                    <p className="text-neutral-500 uppercase text-[10px] font-black tracking-widest mb-1">Rank</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white italic">P{equipo.position_current}</span>
                      <span className="text-neutral-600 text-xs font-bold uppercase tracking-tighter">Posicion</span>
                    </div>
                  </div>

                  <div className="bg-black/30 p-6 rounded-2xl border-l-4 border-[#FFEB00]">
                    <p className="text-neutral-500 uppercase text-[10px] font-black tracking-widest mb-1">Puntos Temporada</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-[#FFEB00] italic leading-none">{equipo.points_current}</span>
                      <span className="text-[#FFEB00]/50 text-xs font-bold uppercase tracking-tighter">Pts</span>
                    </div>
                  </div>
                </div>

                {equipo.pilotos && equipo.pilotos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Alineacion </h2>
                      <div className="h-px flex-1 bg-neutral-700"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {equipo.pilotos.map((piloto) => (
                        <div
                          key={piloto.driver_number}
                          className="group/item mx-auto bg-neutral-950 p-1 rounded-xl flex items-center gap-3 border border-white/5 hover:border-[#00A3FF]/50 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] cursor-pointer"
                        >
                          
                          <div className="w-20 h-20 bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={piloto.headshot_url || Daniel}
                              alt={piloto.full_name}
                              className="z-10 group-hover/item:scale-110 transition-transform"
                            /> 
                          </div>

                          <div className="z-10 flex-1">
                            <p className="text-neutral-500 font-mono text-[10px] leading-none mb-1">#{piloto.driver_number}</p>
                            <p className="text-white font-black italic uppercase text-lg tracking-tighter group-hover/item:text-[#FFEB00] transition-colors">
                              {piloto.full_name}
                            </p>
                          </div>
                          
                          <span className="text-neutral-800 font-black italic text-2xl group-hover/item:text-[#00A3FF]/20 transition-colors">
                            {piloto.driver_number}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
        
                <div className="mt-12 flex justify-between items-center opacity-30">
                  <p className="text-[9px] font-mono tracking-widest uppercase">Sistema: comprobado</p>
                  <div className="flex gap-2">
                      <div className="h-1 w-1 bg-white rounded-full"></div>
                      <div className="h-1 w-1 bg-white rounded-full"></div>
                      <div className="h-1 w-1 bg-[#FFEB00] rounded-full"></div>
                  </div>
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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchEquipos } from "../services/equipoService";
import { getEquipo } from "../utils/getEquipo";

export default function CircuitosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const [equipos, setEquipos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarEquipos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEquipos(page);
        setEquipos(data.equipos);
        setPaginacion(data.paginacion);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarEquipos();
  }, [page]);

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-6 pt-10">
        
        <div className="flex items-end gap-4 mb-12 border-b border-neutral-800 pb-6">
          <div className="h-12 w-2 bg-[#A6051A]"></div>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              <span className="text-[#FFEB00]">Equipos</span>
            </h1>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest mt-1">
              Temporada 2023
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando equipos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && !error && equipos.length === 0 && (
          <p className="text-gray-300">No hay equipos disponibles.</p>
        )}

        {!loading && !error && equipos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {equipos.map((equipo) => (
                <article
                  key={equipo.team_name}
                  onClick={() => navigate(`/equipos/${equipo.team_name}`, { state: { page } })}
                  className="group relative bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer"
                >

                  <div className="p-8 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Escuderia</span>
                        <div className="h-px w-8 bg-neutral-700"></div>
                        <span className="text-[#FFEB00] font-mono text-xs font-bold">P{equipo.position_current}</span>
                      </div>

                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#FFEB00] transition-colors duration-300">
                        {equipo.team_name}
                      </h2>

                      <div className="mt-6 flex gap-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Puntos</span>
                          <span className="text-2xl font-black italic text-white leading-none mt-1">
                            {equipo.points_current}
                          </span>
                        </div>
                        
                        <div className="flex flex-col border-l border-neutral-800 pl-8">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Ranking</span>
                          <span className="text-2xl font-black italic text-white leading-none mt-1">
                            #{equipo.position_current}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-40 w-40 flex items-center justify-center border-2 border-white/5 rounded-full bg-black group-hover:border-[#FFEB00]/30 transition-all">
                      <img
                        src={getEquipo(equipo.team_name)}
                        alt={equipo.team_name}
                        className="max-w-[90%] max-h-[90%]  object-contain p-4 drop-shadow-[0_0_15px_rgba(0,163,255,0.4)] transform transition-transform duration-700 group-hover:scale-110 overflor-hiden"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Mostrar Mas →</span>
                  </div>
                </article>
              ))}
            </div>

            {paginacion && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 py-8 border-t border-neutral-900">
                <button
                  onClick={() => setSearchParams({ page: page - 1 })}
                  disabled={!paginacion.anterior}
                  className="group flex items-center gap-3 px-6 py-3 rounded-full border border-neutral-700 text-neutral-400 disabled:opacity-20 disabled:hover:scale-100 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
                </button>

                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="text-neutral-500 uppercase tracking-tighter">Sector</span>
                  <span className="bg-neutral-800 px-3 py-1 rounded text-[#FFEB00] font-bold">{paginacion.page}</span>
                  <span className="text-neutral-500 italic">of</span>
                  <span className="text-neutral-300 font-bold">{paginacion.total_pages}</span>
                </div>

                <button
                  onClick={() => setSearchParams({ page: page + 1 })}
                  disabled={!paginacion.siguiente}
                  className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#FFEB00] text-black disabled:opacity-20 disabled:hover:scale-100 transition-all hover:bg-white cursor-pointer font-bold uppercase text-xs tracking-widest"
                >
                  Siguiente <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
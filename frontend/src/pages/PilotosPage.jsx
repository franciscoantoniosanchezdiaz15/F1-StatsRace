import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchPilotos } from "../services/pilotoService";
import Daniel from "../assets/Daniel_Ricciardo.png";

export default function PilotosPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();

  const page  = parseInt(searchParams.get("page")) || 1;

  const [pilotos, setPilotos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPilotos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchPilotos(page);
        setPilotos(data.pilotos);
        setPaginacion(data.paginacion)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPilotos();
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-end gap-4 mb-12 border-b border-neutral-800 pb-6">
          <div className="h-12 w-2 bg-[#A6051A]"></div>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              Parrilla de <span className="text-[#FFEB00]">Pilotos</span>
            </h1>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest mt-1">
              Temporada 2023
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando pilotos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && !error && pilotos.length === 0 && (
          <p className="text-center text-neutral-500 py-20">No se han encontrado pilotos en el sector.</p>
        )}

        {!loading && !error && pilotos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pilotos.map((piloto) => {
                const partesNombre = piloto.full_name.split(" ");
                const nombre = partesNombre[0];
                const apellidos = partesNombre.slice(1);

                return (
                <button
                  key={piloto.driver_number}
                  onClick={() => navigate(`/pilotos/${piloto.driver_number}`, { state: { page } })}
                  className="relative group bg-neutral-900 rounded-br-[30px] border border-neutral-800 overflow-hidden transition-all duration-500 hover:border-[#FFEB00]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:-translate-y-2 cursor-pointer"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5 z-20"
                    style={{ backgroundColor: `#${piloto.team_colour}` }}
                  ></div>

                  <div 
                    className="relative h-56 overflow-hidden flex items-end justify-center pt-6 px-4"
                    style={{ background: `linear-gradient(180deg, #${piloto.team_colour}22 0%, #171717 100%)` }}
                  >
                    <span className="absolute top-4 right-4 text-7xl font-black italic text-white/[0.03] group-hover:text-white/[0.07] transition-colors duration-500">
                      {piloto.driver_number}
                    </span>
                    
                    <img
                      src={piloto.headshot_url || Daniel}
                      alt={piloto.full_name}
                      className="relative z-10 w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6 bg-neutral-900">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[#FFEB00] font-mono text-[10px] uppercase tracking-[0.2em]">
                        {piloto.team_name}
                      </p>
                      <span className="text-neutral-600 font-black italic text-lg leading-none">
                        #{piloto.driver_number}
                      </span>
                    </div>
                    
                     <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-[#FFEB00] transition-colors">
                        <span className="block text-sm font-normal not-italic tracking-normal text-neutral-400">
                          {nombre}
                        </span>

                        {apellidos.map((apellido, index) => (
                          <span key={index}>{apellido} </span>
                        ))}
                      </h2>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-neutral-500">PAÍS:</span>
                         <span className="text-xs font-black uppercase">{piloto.country_code}</span>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-[#FFEB00] transition-colors">
                         <span className="text-black text-xs font-bold opacity-0 group-hover:opacity-100">→</span>
                      </div>
                    </div>
                  </div>
                </button>
                )
              })}
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
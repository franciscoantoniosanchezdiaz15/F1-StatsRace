import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchCircuitos } from "../services/circuitoService";
import { getCircuito } from "../utils/getCircuito";

export default function CircuitosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const [circuitos, setCircuitos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCircuitos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCircuitos(page);
        setCircuitos(data.circuitos);
        setPaginacion(data.paginacion);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarCircuitos();
  }, [page]);

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-6 pt-10">
        
        <div className="flex items-end gap-4 mb-12 border-b border-neutral-800 pb-6">
          <div className="h-12 w-2 bg-[#A6051A]"></div>
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              <span className="text-[#FFEB00]">Circuitos</span>
            </h1>
            <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest mt-1">
              Temporada 2023
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando circuitos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && !error && circuitos.length === 0 && (
          <p className="text-gray-300">No hay circuitos disponibles.</p>
        )}

        {!loading && !error && circuitos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {circuitos.map((circuito) => (
                <article
                  key={circuito.circuit_key}
                  onClick={() => navigate(`/circuitos/${circuito.circuit_key}`, {state: { page }})}
                  className="group relative bg-neutral-900/40 rounded-tl-[40px] rounded-br-[40px] border border-neutral-800 p-8 overflow-hidden transition-all duration-500 hover:border-[#00A3FF] hover:bg-neutral-900/80 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[#00A3FF] font-mono text-[10px] tracking-widest uppercase">Location: {circuito.location}</span>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-[#FFEB00] transition-colors">
                        {circuito.circuit_short_name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black italic text-neutral-700 group-hover:text-[#00A3FF] transition-colors leading-none">
                        {circuito.country_code}
                      </p>
                    </div>
                  </div>

                  <div className="relative h-64 w-full flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    <img
                      src={getCircuito(circuito.circuit_key)}
                      alt={circuito.location}
                      className="w-full h-full object-contain p-4 drop-shadow-[0_0_15px_rgba(0,163,255,0.4)] transform transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00A3FF]/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[1.5s] ease-in-out"></div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex gap-4 font-mono text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500"></span> DRS ACTIVO</span>
                      <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500"></span> LISTO</span>
                    </div>
                    <span className="text-[#FFEB00] font-bold text-sm tracking-tighter uppercase italic group-hover:translate-x-2 transition-transform">
                      Ver Detalles →
                    </span>
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
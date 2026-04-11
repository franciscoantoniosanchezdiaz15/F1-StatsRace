import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchEscuderiaDetalle } from "../services/escuderiaService";
import { useRequireAuth } from "../hooks/useRequireAuth";

export default function EscuderiaDetallePage() {
  const { escuderia_id } = useParams();
  const navigate = useNavigate();
  const { loading: loadingAuth, isAuthenticated } = useRequireAuth();

  const [escuderia, setEscuderia] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoadingData(true);
        setError("");

        const data = await fetchEscuderiaDetalle(escuderia_id);
        setEscuderia(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    }

    cargarDetalle();
  }, [escuderia_id]);

  if (loadingAuth || !isAuthenticated) return null;

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate("/escuderias")}
          className="mt-10 group flex items-center gap-3 px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-white/5">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
        </button>

        {loadingData && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando circuito...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loadingData && !error && escuderia && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-[#FFEB00] font-black uppercase tracking-[0.5em] text-[10px] mb-2 block">
                  Official Entry {escuderia_id}
                </span>
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8]">
                  {escuderia.nombre}
                </h1>
              </div>
              
              <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl min-w-[240px]">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black text-neutral-500 uppercase">Budget Usage</p>
                  <p className="text-sm font-black italic">
                    {Math.round((escuderia.coste_total / escuderia.presupuesto_max) * 100)}%
                  </p>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFEB00] transition-all duration-1000" 
                    style={{ width: `${(escuderia.coste_total / escuderia.presupuesto_max) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-[#0f0f0f] border-l-4 border-[#FFEB00] p-8 rounded-r-3xl">
                  <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">Financial Specs</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-neutral-400 mb-1">Capacidad Máxima</p>
                      <p className="text-4xl font-black italic uppercase">{escuderia.presupuesto_max}M</p>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-xs font-bold text-neutral-400 mb-1">Inversión Actual</p>
                      <p className="text-4xl font-black italic uppercase text-[#FFEB00]">{escuderia.coste_total}M</p>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-xs font-bold text-neutral-400 mb-1">Balance Remanente</p>
                      <p className="text-2xl font-black italic text-neutral-500">
                        {escuderia.presupuesto_max - escuderia.coste_total}M
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 border border-white/5 rounded-3xl opacity-50 italic text-xs text-neutral-400 leading-relaxed uppercase font-bold tracking-tighter">
                  "Esta configuración de escudería cumple con las regulaciones de la FIA para la temporada actual."
                </div>
              </aside>

              <div className="lg:col-span-2">
                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                  Official Lineup <div className="h-px bg-white/5 flex-1"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {escuderia.pilotos.map((piloto) => (
                    <div
                      key={piloto.id}
                      className="group bg-neutral-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:bg-neutral-900 transition-all hover:border-[#FFEB00]/30"
                    >
                      <div className="mb-6">
                         <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-neutral-400 uppercase tracking-widest">
                          Driver Profile
                         </span>
                      </div>

                      <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 text-white group-hover:text-[#FFEB00] transition-colors leading-none">
                        {piloto.full_name}
                      </h3>
                      <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-8">
                        {piloto.team_name}
                      </p>

                      <div className="flex justify-between items-center py-4 border-t border-white/5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase">Valuación</span>
                        <span className="text-xl font-black italic text-white">{piloto.precio}M</span>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
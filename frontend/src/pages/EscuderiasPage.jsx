import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchMisEscuderias, eliminarEscuderia } from "../services/escuderiaService";
import { useRequireAuth } from "../hooks/useRequireAuth";

export default function EscuderiasPage() {
  const navigate = useNavigate();
  const { loading: loadingAuth, isAuthenticated } = useRequireAuth();

  const [escuderias, setEscuderias] = useState([]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  async function cargarEscuderias() {
    try {
      setLoadingData(true);
      setError("");

      const data = await fetchMisEscuderias();
      setEscuderias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    cargarEscuderias();
  }, []);

  async function handleEliminar(id) {
    try {
      await eliminarEscuderia(id);
      await cargarEscuderias();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loadingAuth || !isAuthenticated) return null;

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Mis <span className="text-[#FFEB00]">Equipos</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                central de gestión de equipos
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/escuderias/crear")}
              className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-none hover:bg-[#FFEB00] transition-all skew-x-[-12deg]"
            >
              <span className="inline-block skew-x-[12deg]">+ Nueva Escudería</span>
            </button>
            
            <button
              onClick={() => navigate("/duelos/escuderias")}
              className="px-8 py-4 bg-[#FFEB00] text-black font-black uppercase text-xs tracking-widest rounded-none hover:brightness-110 transition-all skew-x-[-12deg]"
            >
              <span className="inline-block skew-x-[12deg]">Ir a Competición</span>
            </button>
          </div>

        </div>

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

        {!loadingData && !error && escuderias.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/20 border border-white/5 rounded-3xl">
            <p className="text-neutral-500 font-black italic uppercase text-2xl tracking-tighter">No hay unidades registradas</p>
          </div>
        )}

        {!loadingData && !error && escuderias.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {escuderias.map((escuderia) => (
              <article
                key={escuderia.id}
                className="group relative bg-[#0f0f0f] border border-white/5 hover:border-[#FFEB00]/50 transition-all duration-500 p-8 rounded-[2rem] overflow-hidden"
              >
                <span className="absolute top-4 right-2 text-9xl font-black italic text-white/[0.02] pointer-events-none group-hover:text-[#FFEB00]/[0.05] transition-colors uppercase">
                  {escuderia.nombre.substring(0, 2)}
                </span>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">    
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {escuderia.nombre}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-1">Presupuesto</p>
                      <p className="text-2xl font-black italic text-white">{escuderia.presupuesto_max}M</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl">
                      <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-1">Coste Real</p>
                      <p className={`text-2xl font-black italic ${escuderia.coste_total > escuderia.presupuesto_max ? 'text-red-500' : 'text-[#FFEB00]'}`}>
                        {escuderia.coste_total}M
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2">Lineup</p>
                    <div className="space-y-3">
                      {escuderia.pilotos.map((piloto) => (
                        <div key={piloto.id} className="flex justify-between items-center group/item">
                          <div>
                            <p className="font-black italic uppercase tracking-tight text-sm text-neutral-200">{piloto.full_name}</p>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase">{piloto.team_name}</p>
                          </div>
                          <span className="text-[10px] font-black text-white px-2 py-1 bg-white/5 rounded italic group-hover/item:bg-[#FFEB00] group-hover/item:text-black transition-colors">
                            {piloto.precio}M
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-white/5">
                    <button
                      onClick={() => navigate(`/escuderias/${escuderia.id}`)}
                      className="flex-1 py-3 bg-neutral-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
                    >
                      Ver detalle
                    </button>

                    <button
                      onClick={() => handleEliminar(escuderia.id)}
                      className="px-6 py-3 border border-red-900/30 text-red-500/50 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      Despedir pilotos
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
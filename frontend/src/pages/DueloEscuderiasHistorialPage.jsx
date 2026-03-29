import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import {
  fetchHistorialDuelosEscuderia,
  eliminarDueloEscuderia,
} from "../services/dueloEscuderiasService";

export default function DueloEscuderiasHistorialPage() {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarHistorial() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchHistorialDuelosEscuderia();
      setHistorial(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function handleEliminar(id) {
    if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      await eliminarDueloEscuderia(id);
      await cargarHistorial();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>  
            <button
              onClick={() => navigate("/duelos/escuderias")}
              className="group flex items-center gap-3 px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-white/5">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
            </button>

            <h1 className="mt-10 text-4xl font-black italic uppercase tracking-tighter">
              Historial de <span className="text-[#FFEB00]">Duelos</span>
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total Registros</span>
            <p className="text-2xl font-mono text-[#FFEB00] leading-none">{historial.length}</p>
          </div>
        </div>

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

        {!loading && !error && historial.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-dashed border-neutral-700">
            <p className="text-gray-500 italic">No hay datos de carrera disponibles en la base de datos.</p>
          </div>
        )}

        {!loading && !error && historial.length > 0 && (
          <div className="space-y-4">
            {historial.map((duelo) => (
              <DueloCard key={duelo.id} duelo={duelo} onEliminar={handleEliminar} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DueloCard({ duelo, onEliminar }) {
  const esCarrera = duelo.modo === "carrera";
  const ganoUsuario = duelo.ganador === duelo.escuderia_usuario_nombre;

  return (
    <article className="group bg-neutral-900 border-l-4 border-l-neutral-700 hover:border-l-[#FFEB00] border-y border-r border-neutral-800 rounded-r-xl p-5 transition-all hover:bg-neutral-850">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${esCarrera ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {duelo.modo}
            </span>
            <span className="text-xs text-gray-500 font-mono italic">{duelo.circuito}</span>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className={ganoUsuario ? "text-[#FFEB00]" : "text-white"}>{duelo.escuderia_usuario_nombre}</span>
            <span className="text-gray-600 text-sm font-light italic px-2">VS</span>
            <span className={!ganoUsuario ? "text-[#FFEB00]" : "text-white"}>{duelo.escuderia_rival_nombre}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-8">
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Usuario</p>
            <p className="text-lg font-mono tracking-tighter">
              {duelo.tiempo_usuario} <span className="text-[10px] text-gray-500">{esCarrera ? 'PTS' : 'S'}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1 italic">Rival</p>
            <p className="text-lg font-mono text-gray-300 tracking-tighter">
              {duelo.tiempo_rival} <span className="text-[10px] text-gray-600">{esCarrera ? 'PTS' : 'S'}</span>
            </p>
          </div>

          <div className="hidden md:block">
            <p className="text-[10px] uppercase text-[#FFEB00] font-black mb-1 italic tracking-widest">Distancia</p>
            <p className="text-lg font-mono text-[#FFEB00]">
              {/* Aquí se aplica la lógica que pediste */}
              {duelo.diferencia} 
              <span className="ml-1 text-[10px] font-bold uppercase">
                {esCarrera ? "puntos" : "seg"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end lg:w-10">
           <button
            onClick={() => onEliminar(duelo.id)}
            className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

      </div>
    </article>
  );
}
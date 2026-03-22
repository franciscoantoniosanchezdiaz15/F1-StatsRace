import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchCircuitoDetalle } from "../services/circuitoService";
import { getCircuito } from "../utils/getCircuito";

const formatearFechaF1 = (fechaStr) => {
  if (!fechaStr) return "PENDIENTE";
  const fecha = new Date(fechaStr);
  const dias = fecha.getDate();
  const mes = fecha.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
  const anio = fecha.getFullYear();
  return `${dias} DE ${mes} DE ${anio}`;
};

export default function CircuitoDetalle() {
  const { circuito_key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = location.state?.page || 1;

  const [circuito, setCircuito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCircuitoDetalle(circuito_key);
        setCircuito(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [circuito_key]);

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10">

        {loading && <p className="text-white">Cargando detalle del circuito...</p>}

        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && circuito && (
          <article className="relative bg-neutral-900 rounded-tr-[50px] rounded-bl-[50px] border-l-4 border-t-4 border-neutral-700 shadow-2xl flex flex-col xl:flex-row items-stretch overflow-hidden animate-fade-in transition-all duration-300 ease-out">
            
            <div className="relative w-full xl:w-1/2 flex flex-col items-center justify-center p-8 z-10 border-b-4 border-[#0070FF] xl:border-b-0 xl:border-r-4">
              <div className="relative w-full  bg-[#00A3FF]/20 rounded-2xl border-4 border-[#0070FF] flex items-center justify-center p-6 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-950 opacity-40 z-0"></div>
              
                <img
                  src={getCircuito(circuito.circuit_key)}
                  alt={circuito.circuit_short_name}
                  className="max-w-[100%] max-h-[100%] object-contain drop-shadow-[0_0_15px_rgba(0,112,255,0.8)] z-10"
                />

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0070FF] shadow-[0_0_20px_#0070FF]"></div>
              </div>

            </div>

            <div className="w-full xl:w-1/2 p-12 flex flex-col justify-between z-10 relative">
              <header className="mb-10">
                <p className="text-[#FFEB00] font-mono tracking-widest uppercase text-sm mb-1">Official F1 Circuit Profile</p>
                <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-white">
                  {circuito.circuit_short_name}
                </h1>
                <div className="h-2 w-32 mt-4 bg-[#FFEB00] shadow-[0_0_15px_#FFEB00]"></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">País / Ubicación</p>
                  <p className="text-3xl font-extrabold text-neutral-100">{circuito.country_name}</p>
                  <p className="text-xl text-neutral-400 font-medium">{circuito.location}</p>
                </div>

                <div className="pt-6 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Código País</p>
                  <p className="text-5xl font-black text-[#FFEB00] italic">{circuito.country_code}</p>
                </div>
              </div>

              <div className="relative bg-neutral-950/70 border border-neutral-700 rounded-2xl p-6 mb-12 shadow-inner overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFEB00] shadow-[0_0_10px_#FFEB00]"></div>
                <p className="text-neutral-400 uppercase text-xs font-bold tracking-widest mb-1">Fecha de Carrera (GP)</p>
                <p className="text-3xl font-bold text-white uppercase italic tracking-tighter">
                  {formatearFechaF1(circuito.date_start)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-neutral-500 font-mono pt-6 border-t border-neutral-800">
                <p>Circuito Key: <span className="text-neutral-300">{circuito.circuit_key}</span></p>
                <p>Session Key: <span className="text-neutral-300">{circuito.session_key}</span></p>
              </div>
            </div>
          </article>
        )}

        {!loading && !error && circuito && circuito.podium && circuito.podium.length > 0 && (
          <div className="mt-16">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-[#FFEB00] mb-8 text-center">
              Podium
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {circuito.podium.map((piloto) => (
                <div
                  key={`${piloto.session_key}-${piloto.position}-${piloto.driver_number}`}
                  className={`relative flex flex-col justify-between p-6 rounded-tl-3xl rounded-br-3xl border-2 shadow-2xl transition-all duration-300 ${
                    piloto.position === 1
                      ? 'bg-neutral-900 border-[#FFD700] scale-105 h-[300px]' // ORO 
                      : piloto.position === 2
                      ? 'bg-neutral-950 border-[#C0C0C0] h-[260px]' // PLATA
                      : 'bg-neutral-950 border-[#CD7F32] h-[240px]' // BRONCE
                  }`}
                >
                  <span className={`absolute top-2 right-4 text-9xl font-black italic opacity-30 ${
                    piloto.position === 1 ? 'text-[#FFD700]' : piloto.position === 2 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'
                  }`}>
                    {piloto.position}
                  </span>

                  <div className="z-10 mt-auto">
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Piloto</p>
                    <p className="text-2xl font-black italic leading-tight text-white mb-2">{piloto.full_name}</p>
                    
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Equipo</p>
                    <p className="text-lg font-bold text-neutral-200 uppercase italic">{piloto.team_name}</p>
                  </div>

                  <div className="z-10 mt-4 pt-4 border-t border-neutral-800 flex justify-end">
                    <p className="text-5xl font-black italic" style={{ color: piloto.position === 1 ? '#FFD700' : piloto.position === 2 ? '#C0C0C0' : '#CD7F32' }}>
                      {piloto.points} <span className="text-base font-normal uppercase not-italic">PTS</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </section>

      <button
        onClick={() => navigate(`/circuitos?page=${page}`)}
        className="mt-10 px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-50 transition-all duration-300 hover:bg-yellow-300 hover:scale-105 cursor-pointer font-bold"
      >
        ← Volver
      </button>

    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners"
import bg from "../assets/f1-bg.png"

function LoadingScreen() {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    },2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A6051A]/20 to-transparent"></div>
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

     <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        
        <div className="mb-8 flex items-center justify-center">
           <div className="relative">
              <div className="w-16 h-16 border-2 border-[#A6051A]/30 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-[#FFEB00] rounded-full animate-spin"></div>
           </div>
        </div>

        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
          Iniciando <span className="text-[#FFEB00]">Sistema</span>
        </h2>

        <div className="flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
          <span className="text-green-500">●</span> Status: Cargando
        </div>

        <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5 mb-6">
          <BarLoader
            color="#A6051A"
            loading={true}
            width={800}
            height={10}
            speedMultiplier={0.8}
          />
        </div>

        <div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-left shadow-2xl">
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-900 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="ml-2 text-[10px] text-neutral-600 uppercase">Terminal v1.0.4</span>
          </div>
          <p className="text-[#FFEB00] text-xs uppercase animate-pulse">
              Preparando estadísticas, pilotos y simulaciones de carrera.
          </p>
          <p className="text-neutral-700 text-[9px] mt-2 uppercase tracking-widest">
            F1_STATS_RACE: OK... Estado: optimo...
          </p>
        </div>

        <div className="relative group w-full opacity-80 grayscale hover:grayscale-0 transition-all duration-700">    
          <img
            src={bg}
            alt="F1 StatsRace"
            className="w-full max-w-lg mx-auto object-contain group-hover:blur-0 transition-all"
          />
        </div>

        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.5em]">
          Luz verde para arrancar
        </p>

      </div>
    </div>
  )
}

export default LoadingScreen
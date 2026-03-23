import { useNavigate } from "react-router-dom";
import bg from "../assets/f1-bg.png"

function StartScreen() {

  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">

          <div className="relative z-10 w-full max-w-4xl bg-neutral-900/40 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col items-center">
            
            <div className="flex items-center gap-3 mb-6 bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">Sistema Activado // By Francisco</p>
            </div>

            <h1 className="text-6xl md:text-8xl font-black italic mb-4 text-white uppercase tracking-tighter leading-none text-center">
              F1 <span className="text-[#FFEB00]">Stats</span>Race
            </h1>

            <div className="h-1 w-24 bg-[#A6051A] mb-8 shadow-[0_0_15px_#A6051A]"></div>
        
            <button
              onClick={() => navigate("/loading")}
              className="group relative px-12 py-4 bg-[#A6051A] rounded-tl-2xl rounded-br-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(166,5,26,0.4)] cursor-pointer" 
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-tl-2xl rounded-br-2xl"></div>
              <span className="relative z-10 text-white font-black uppercase tracking-[0.2em] text-lg">
                INICIAR SECUENCIA
              </span>
            </button>

            <div className="mt-12 w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#A6051A] to-[#FFEB00] rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black rounded-xl overflow-hidden border border-white/10">
                <img
                  src={bg}
                  alt="F1 StatsRace"
                  className="w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"   
                />
              </div>
            </div>

          </div>
    </div>
  )
}

export default StartScreen
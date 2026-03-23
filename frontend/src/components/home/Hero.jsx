import bg from "../../assets/f1-bg.png"
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();
 
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative md:py-32 grid grid-cols-1 lg:grid-cols-2 items-center">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        
        <div className="text-left z-10">

          <h2 className="text-6xl md:text-7xl font-black leading-[0.9] italic uppercase tracking-tighter text-white">
            Analiza <span className="text-[#A6051A]">Pilotos</span> <br /> 
            & Simula <span className="text-[#FFEB00]">Duelos</span>
          </h2>

          <p className="mt-8 text-lg text-gray-400 max-w-lg leading-relaxed font-medium">
            Siente la telemetría en tus manos. Consulta estadísticas reales, compara 
            rendimientos históricos y descubre quién dominaría la pista en un duelo.
          </p>

          <div className="mt-10 flex flex-wrap gap-6">
            <button className="relative px-8 py-4 bg-[#A6051A] text-white font-black uppercase tracking-widest text-sm rounded-tl-2xl rounded-br-2xl transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer">
              Comenzar ahora
            </button>

            <button 
              onClick={() => navigate("/pilotos")}
              className="px-8 py-4 border-2 border-[#FFEB00] text-[#FFEB00] font-black uppercase tracking-widest text-sm rounded-tr-2xl rounded-bl-2xl transition-all duration-300 hover:bg-[#FFEB00] hover:text-black cursor-pointer shadow-[4px_4px_0px_0px_rgba(255,235,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Ver pilotos
            </button>
          </div>

        </div>
      </div>

      <div className="relative group">
          <div className="absolute -inset-4 border-2 border-white/5 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
          
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-red-900/20">
            
            <img
              src={bg}
              alt="F1 StatsRace Hero"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur-md p-4 border-l-4 border-[#A6051A]">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Estado del Circuito</p>
              <p className="text-white font-black italic uppercase italic">Listo para correr</p>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Hero
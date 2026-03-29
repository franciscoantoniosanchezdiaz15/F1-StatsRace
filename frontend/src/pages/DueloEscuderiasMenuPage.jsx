import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import bgTiempo from "../assets/tiempo.png";
import bgCarrera from "../assets/carrera.png";

export default function DueloEscuderiasMenuPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/duelos")}
          className="group flex items-center gap-3 px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-white/5">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
        </button>

        <header className="mb-12 mt-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Duelo de <span className="text-[#FFEB00]">Escuderías</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Selecciona el formato de competición para el enfrentamiento.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ModeCard
            onClick={() => navigate("/duelos/escuderias/carrera")}
            title="Carrera Completa"
            image={bgCarrera}
            description="Simulación total: gestión de ritmo, consistencia y victoria final en pista."
          />
          
          <ModeCard
            onClick={() => navigate("/duelos/escuderias/mejor-tiempo")}
            title="Mejor Tiempo"
            image={bgTiempo}
            description="Pura velocidad: una batalla a una sola vuelta para dominar el cronómetro."
          />
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/duelos/escuderias/historial")}
            className="px-8 py-3 border border-neutral-700 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Ver historial de duelos
          </button>
        </div>
      </section>
    </div>
  );
}

function ModeCard({ title, description, image, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#FFEB00]/50 transition-all duration-500"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h2 className="text-3xl font-black italic uppercase text-white mb-2 group-hover:text-[#FFEB00] transition-colors">
          {title}
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed max-w-[280px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {description}
        </p>
      </div>

      {/* Indicador visual de "Acción" */}
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#FFEB00] flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_20px_rgba(255,235,0,0.4)]">
        <span className="text-black text-2xl font-bold">→</span>
      </div>
    </article>
  );
}
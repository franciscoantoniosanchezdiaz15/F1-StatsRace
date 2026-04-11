import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/home/Navbar";
import bg_pilotos from "../assets/f1_coche_fondo.png"
import bg_escuderias from "../assets/f1_escuderia_fondo.png"
import { useRequireAuth } from "../hooks/useRequireAuth";

const instrucciones = {
  pilotos: {
    titulo: "Batalla con Pilotos",
    pasos: [
      "Elige el tipo de enfrentamiento: Carrera Completa o Mejor Tiempo.",
      "Selecciona tu piloto, un circuito y un piloto rival para poder competir.",
      "Configura la estrategia para tu piloto, seleccionando el neumático con el que competira.",
      "Lanza la simulación y que gane el mejor coach junto a su piloto.",
    ],
  },
  escuderias: {
    titulo: "Batalla de Escuderías",
    pasos: [
      "Crea o selecciona dos escuderías personalizadas.",
      "Asigna pilotos y configura el coche de cada escudería.",
      "Elige el tipo de enfrentamiento: Carrera Completa o Mejor Tiempo.",
      "Lanza la simulación y compara el rendimiento de ambas escuderías.",
    ],
  },
};

export default function DuelosPage() {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useRequireAuth();
  const [modalAbierto, setModalAbierto] = useState(null); // pilotos, escuderias

  if (loading || !isAuthenticated) return null;

  const info = modalAbierto ? instrucciones[modalAbierto] : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalAbierto(null)}
        >
          <div
            className="relative bg-neutral-950 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalAbierto(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#FFEB00] flex items-center justify-center">
                <span className="text-black font-black text-sm">?</span>
              </div>
              <h2 className="text-xl font-bold">{info.titulo}</h2>
            </div>

            <ol className="space-y-4">
              {info.pasos.map((paso, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs text-neutral-400">
                    {i + 1}
                  </span>
                  <p className="text-neutral-300 text-sm leading-relaxed pt-0.5 text-left">{paso}</p>
                </li>
              ))}
            </ol>

            <button
              onClick={() => setModalAbierto(null)}
              className="mt-8 w-full py-2.5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-[#FFEB00] transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-baseline gap-4 mb-16 border-l-4 border-[#A6051A] pl-6">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Modo <span className="text-[#FFEB00]">Duelo</span>
          </h1>
          <p className="text-neutral-500 font-mono text-sm uppercase tracking-[0.3em]">
            // Selecciona un modo de juego para empezar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <article
            onClick={() => navigate("/duelos/pilotos")}
            className="group relative h-[500px] rounded-[40px] overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#FFEB00]/50 hover:shadow-[0_0_50px_rgba(255,235,0,0.1)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${bg_pilotos})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <button
              onClick={(e) => { e.stopPropagation(); setModalAbierto("pilotos"); }}
              className="absolute top-5 right-5 z-10 w-15 h-15 rounded-full bg-black border border-white/20 flex items-center justify-center text-white font-bold text-sm hover:bg-[#FFEB00] hover:text-black hover:border-[#FFEB00] transition-all  shadow-[0_0_12px_rgba(255,235,0,0.9)]"
              title="Ver instrucciones"
            >
              Como Jugar
            </button>

            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#FFEB00]"></span>
                <span className="text-[#FFEB00] font-mono text-xs font-bold uppercase tracking-widest">Protocolo 01</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Batalla con pilotos</h2>
              <p className="text-gray-300 text-lg">
                Enfrenta dos pilotos en una simulación de carrera completa o de mejor tiempo.
              </p>
              <div className="flex items-center gap-4">
                <div className="px-6 py-2 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full group-hover:bg-[#FFEB00] transition-colors">
                  Configurar Duelo
                </div>
                <span className="text-white/20 font-mono text-xs uppercase italic">Radar Active</span>
              </div>
            </div>
          </article>

          <article
            onClick={() => navigate("/duelos/escuderias")}
            className="group relative h-[500px] rounded-[40px] overflow-hidden border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#A6051A]/50 hover:shadow-[0_0_50px_rgba(166,5,26,0.1)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${bg_escuderias})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <button
              onClick={(e) => { e.stopPropagation(); setModalAbierto("escuderias"); }}
              className="absolute top-5 right-5 z-10 w-15 h-15 rounded-full bg-black border border-white/20 flex items-center justify-center text-white font-bold text-sm hover:bg-[#A6051A] hover:border-[#A6051A] transition-all shadow-[0_0_12px_rgba(166,5,26,0.9)]"
              title="Ver instrucciones"
            >
              Como Jugar
            </button>

            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#A6051A]"></span>
                <span className="text-[#A6051A] font-mono text-xs font-bold uppercase tracking-widest">Protocolo 02</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Batalla de escuderías personalizadas</h2>
              <p className="text-gray-300 text-lg">
                Usa escuderías creadas por ti y enfréntalas en carrera completa o mejor tiempo.
              </p>
              <div className="flex items-center gap-4">
                <div className="px-6 py-2 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full group-hover:bg-[#A6051A] group-hover:text-white transition-colors">
                  configurar duelo
                </div>
                <span className="text-white/20 font-mono text-xs uppercase italic">Sync Ready</span>
              </div>
            </div>
          </article>

        </div>

        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-600 uppercase font-black">Latencia</span>
              <span className="text-xs font-mono text-green-500">0.002s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-600 uppercase font-black">Algoritmo</span>
              <span className="text-xs font-mono">Francisco A.</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-neutral-700 uppercase tracking-[0.4em]">
            Entorno de simulación autorizado
          </p>
        </div>
      </section>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import DueloPilotosForm from "../components/duelos/DueloPilotosForm";

export default function DueloPilotosMejorTiempoPage() {
  const navigate = useNavigate();

  async function handleContinue(payload, pilotos) {
    const pilotoUsuario = pilotos.find(
      (piloto) => piloto.driver_number === payload.driver_number_1
    );

    navigate("/duelos/pilotos/mejor-tiempo/neumaticos", {
      state: {
        configDuelo: payload,
        pilotoUsuario,
      },
    });
  }

  return (
    <div>
      <Navbar />

      <div className="w-full bg-neutral-900/50 border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/duelos/pilotos")}
            className="group flex items-center gap-2 text-neutral-500 hover:text-[#FFEB00] transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Abandonar
            </span>
          </button>

          <div className="flex gap-8 items-center">
            <Step num="1" label="Configuración" active />
            <div className="w-12 h-[1px] bg-neutral-800"></div>
            <Step num="2" label="Estrategia" />
            <div className="w-12 h-[1px] bg-neutral-800"></div>
            <Step num="3" label="Carrera" />
          </div>

          <div className="hidden md:block w-[100px]"></div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
            configuracion <span className="text-[#FFEB00]">de duelo</span>
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm font-medium uppercase tracking-wide">
            Establece las condiciones de pista y selecciona a tu oponente para iniciar la simulación.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[#FFEB00]/5 blur-[120px] rounded-full -z-10 h-1/2 w-1/2 mx-auto"></div>

          <div className="bg-neutral-900/40 rounded-[48px] border border-white/5 p-4 md:p-8 backdrop-blur-sm">
            <DueloPilotosForm modo="mejor-tiempo" onContinue={handleContinue} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <InfoCard text="El crono final se decide por la vuelta más rápida." />
          <InfoCard text="El compuesto elegido influye en el rendimiento del intento." />
          <InfoCard text="Comparativa directa 1v1 basada en velocidad pura." />
        </div>
      </main>
    </div>
  );
}

function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500
          ${
            active
              ? "bg-[#FFEB00] text-black ring-4 ring-[#FFEB00]/20" : 
              done ? "bg-neutral-700 text-[#FFEB00]" : "bg-neutral-800 text-neutral-500"}`}>
        {num}
      </div>
      <span
        className={`text-[10px] font-black uppercase tracking-widest hidden lg:block
          ${active ? "text-white" : "text-neutral-600"}`}>
        {label}
      </span>
    </div>
  );
}

function InfoCard({ text }) {
  return (
    <div className="flex items-center gap-4 bg-neutral-900/30 p-5 rounded-[24px] border border-white/5">
      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0"></div>
      <span className="text-[10px] font-bold uppercase text-neutral-400 leading-tight tracking-wide">
        {text}
      </span>
    </div>
  );
}
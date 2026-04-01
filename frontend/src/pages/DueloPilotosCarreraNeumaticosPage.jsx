import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import DueloPilotosNeumaticosForm from "../components/duelos/DueloPilotosNeumaticosForm";
import { simularDueloPilotosCarrera } from "../services/dueloPilotosService";

export default function DueloPilotosCarreraNeumaticosPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const configDuelo = location.state?.configDuelo;
  const pilotoUsuario = location.state?.pilotoUsuario;

  async function handleSubmit(payloadFinal) {
    const resultado = await simularDueloPilotosCarrera(payloadFinal);

    navigate("/duelos/pilotos/resultado", {
      state: { resultado },
    });
  }

  if (!configDuelo || !pilotoUsuario) {
    return (
      <div>
        <Navbar />
        <section className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="bg-neutral-900 border-2 border-red-600/20 p-10 rounded-[40px] shadow-2xl">
            <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">
              Sesión Expirada
            </h2>
            <p className="text-neutral-400 mb-8 font-medium">
              Los datos de telemetría se han perdido. Por favor, reinicia la configuración del duelo.
            </p>
            <button
              onClick={() => navigate("/duelos/pilotos/carrera")}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#FFEB00] transition-colors"
            >
              Reiniciar Duelo
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="w-full bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/duelos/pilotos/carrera", { state: location.state })}
            className="group flex items-center gap-2 text-neutral-400 hover:text-[#FFEB00] transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              Ajustes de Pista
            </span>
          </button>

          <div className="flex gap-4 items-center">
            <Step num="1" label="Config" done />
            <div className="w-8 h-[2px] bg-[#FFEB00]"></div>
            <Step num="2" label="Estrategia" active />
            <div className="w-8 h-[2px] bg-neutral-800"></div>
            <Step num="3" label="Carrera" />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-900 rounded-[32px] p-6 border border-neutral-800 overflow-hidden relative">
              <h4 className="text-[10px] font-black text-[#FFEB00] uppercase tracking-widest mb-4 flex items-center gap-2">
                Telemetria
              </h4>

              <ul className="space-y-4">
                <InfoRow label="Modo" value={configDuelo.modo === "carrera" ? "Full Race" : "Quick Lap"}/>
                <InfoRow label="Circuito" value={configDuelo.circuito_key || "Aleatorio"}/>
                <InfoRow label="Oponente" value={configDuelo.modo_rival === "manual" ? "Específico" : "Random"}/>
              </ul>
            </div>

            <div className="p-6 rounded-[32px] bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700">
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-2 leading-tight">
                Aviso del Ingeniero:
              </p>
              <p className="text-xs italic text-neutral-300">
                "El compuesto elegido afectará al agarre y al ritmo del piloto. Elige con sabiduría."
              </p>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <DueloPilotosNeumaticosForm
              configDuelo={configDuelo}
              pilotoUsuario={pilotoUsuario}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black 
          ${active ? "bg-[#FFEB00] text-black shadow-[0_0_15px_rgba(255,235,0,0.4)]" : 
            done ? "bg-neutral-700 text-[#FFEB00]" : "bg-neutral-800 text-neutral-600"}`}>
        {num}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest hidden sm:block
        ${active ? "text-white" : "text-neutral-600"}`}>
        {label}
      </span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col border-b border-neutral-800 pb-2">
      <span className="text-[8px] text-neutral-500 font-bold uppercase">
        {label}
      </span>
      <span className="text-xs font-black italic uppercase text-neutral-200">
        {value}
      </span>
    </div>
  );
}
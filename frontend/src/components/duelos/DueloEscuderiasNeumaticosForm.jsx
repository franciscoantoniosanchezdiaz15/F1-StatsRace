import { useMemo, useState } from "react";

const COMPUESTOS = [
  { id: "SOFT", nombre: "Blando", color: "bg-red-600", border: "border-red-600", texto: "text-red-500", emoji: "🔴" },
  { id: "MEDIUM", nombre: "Medio", color: "bg-yellow-500", border: "border-yellow-500", texto: "text-yellow-500", emoji: "🟡" },
  { id: "HARD", nombre: "Duro", color: "bg-white", border: "border-neutral-300", texto: "text-white", emoji: "⚪" },
];

export default function DueloEscuderiasNeumaticosForm({
  configDuelo,
  escuderiaUsuario,
  onSubmit,
}) {
  const [compuestosUsuario, setCompuestosUsuario] = useState({});
  const [paradasUsuario, setParadasUsuario] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pilotos = useMemo(() => escuderiaUsuario?.pilotos || [], [escuderiaUsuario]);

  function handleCompuestoChange(driverNumber, compuesto) {
    setCompuestosUsuario((prev) => {
      // Creamos una copia del estado anterior
      const nuevoEstado = { ...prev };
      
      // Asignamos el nuevo valor usando la clave dinámica
      nuevoEstado[driverNumber] = compuesto;
      
      return nuevoEstado;
    });
  }

  function handleParadasChange(driverNumber, valor) {
    setParadasUsuario((prev) => {
      // Creamos una copia del estado anterior
      const nuevoEstado = { ...prev };
      
      // Asignamos el nuevo valor usando la clave dinámica
      nuevoEstado[driverNumber] = valor;
      
      return nuevoEstado;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setSubmitting(true);

      for (const piloto of pilotos) {
        if (!compuestosUsuario[piloto.driver_number]) {
          throw new Error(`Debes elegir neumático para ${piloto.full_name}`);
        }

        if (paradasUsuario[piloto.driver_number] == undefined || paradasUsuario[piloto.driver_number] == "") {
          throw new Error(`Debes predecir las paradas de ${piloto.full_name}`);
        }
      }

      const paradasNormalizadas = {};

      for (const piloto of pilotos) {
        paradasNormalizadas[piloto.driver_number] = Number(paradasUsuario[piloto.driver_number]);
      }

      const payloadFinal = {
        ...configDuelo,
        compuestos_usuario: compuestosUsuario,
        paradas_usuario: paradasNormalizadas,
      };

      await onSubmit(payloadFinal);
    } catch (err) {
      setError(err.message);
      window.scrollTo({
        top: 0
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!escuderiaUsuario) {
    return (
      <div className="max-w-5xl mx-auto px-10 py-20 text-center">
        <p className="text-red-400 font-black uppercase tracking-widest">⚠️ Error: Escudería no localizada</p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-10 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <span className="text-[#FFEB00] font-mono text-xs uppercase tracking-[0.4em]">Pit Lane Strategy</span>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter mt-2">
            Elección de <span className="text-[#FFEB00]">Compuestos</span>
          </h1>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-2xl">🏎️</div>
            <div>
                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Escudería</p>
                <p className="text-white font-bold italic">{escuderiaUsuario.nombre}</p>
            </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white font-black uppercase text-[10px] tracking-widest p-3 rounded-lg mb-8 animate-pulse text-center">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-10" 
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {pilotos.map((piloto) => (
            <div
              key={piloto.driver_number}
              className="bg-neutral-900 rounded-[32px] border border-neutral-800 overflow-hidden group hover:border-neutral-600 transition-all shadow-2xl"
            >
              <div className="flex p-6 gap-6 items-center bg-gradient-to-r from-black to-transparent">
                <div className="relative">
                    <div className="absolute -bottom-2 -right-4 bg-[#FFEB00] text-black w-8 h-8 rounded-lg flex items-center justify-center font-black italic shadow-lg">
                        {piloto.driver_number}
                    </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                    {piloto.full_name}
                  </h3>
                  <p className="text-[#FFEB00] text-xs font-bold uppercase tracking-widest opacity-80">
                    {piloto.team_name}
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-4 text-center">
                  Selecciona Compuesto Inicial
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {COMPUESTOS.map((c) => {
                    const isSelected = compuestosUsuario[piloto.driver_number] === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCompuestoChange(piloto.driver_number, c.id)}
                        className={`
                          relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300
                          ${isSelected 
                            ? `${c.border} bg-neutral-800 scale-105 shadow-xl` 
                            : 'border-neutral-800 bg-black hover:border-neutral-600 opacity-60 hover:opacity-100'}
                        `}
                      >
                        <div className={`w-10 h-10 rounded-full border-[6px] ${isSelected ? c.border : 'border-neutral-700'} flex items-center justify-center bg-transparent shadow-inner`}>
                            <div className={`w-3 h-3 rounded-full ${isSelected ? c.color : 'bg-neutral-700'}`}></div>
                        </div>
                        
                        <span className={`font-black text-[10px] uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-neutral-500'}`}>
                          {c.nombre}
                        </span>

                        {isSelected && (
                           <div className="absolute -top-1 -right-1">
                               <span className="flex h-3 w-3 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                               </span>
                           </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <label className="block text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-3 text-center">
                  Predice paradas en boxes
                </label>

                <input type="number" min="0" max="6" value={paradasUsuario[piloto.driver_number] ?? ""} onChange={(e) => handleParadasChange(piloto.driver_number, e.target.value)} placeholder="De 0 a 6"
                  className="w-50 m-3 bg-black border border-neutral-700 rounded-2xl py-4 text-center text-2xl font-black text-white focus:outline-none focus:border-[#FFEB00]"
                />
              </div>
        
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center pt-8">
            <button
            type="submit"
            disabled={submitting}
            className={`
                group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-500
                ${submitting ? 'bg-neutral-800 cursor-not-allowed' : 'bg-[#FFEB00] hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,235,0,0.2)]'}
            `}
            >
            <div className="relative z-10 flex items-center gap-4">
                <span className="text-black font-black uppercase tracking-[0.2em] text-lg">
                {submitting ? "Procesando Telemetría..." : "¡A Pista!"}
                </span>
                {!submitting && (
                    <span className="bg-black text-[#FFEB00] w-10 h-10 rounded-full flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                        🏁
                    </span>
                )}
            </div>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
            </button>
            <p className="mt-4 text-neutral-600 font-mono text-[10px] uppercase tracking-widest">
                Ready for Green Lights
            </p>
        </div>
      </form>
    </section>
  );
}
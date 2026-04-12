import { useEffect, useState } from "react";
import { fetchDatosDueloPilotos } from "../../services/dueloPilotosService";
import { useNavigate } from "react-router-dom";
import circuitosFoto from "../../assets/circuitos_foto.png";
import usuario from "../../assets/usuario.png";
import rival from "../../assets/rivales.png";
import { fetchRecomendacionRival } from "../../services/iaService";

export default function DueloPilotosForm({ modo, onContinue }) {
  const navigate = useNavigate();

  const [pilotos, setPilotos] = useState([]);
  const [circuitos, setCircuitos] = useState([]);

  const [driverNumber1, setDriverNumber1] = useState("");
  const [modoRival, setModoRival] = useState("manual");
  const [driverNumber2, setDriverNumber2] = useState("");

  const [modoCircuito, setModoCircuito] = useState("manual");
  const [circuitoKey, setCircuitoKey] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorForm, setErrorForm] = useState("");

  const [recomendacionIA, setRecomendacionIA] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [errorIA, setErrorIA] = useState("");

  const [modalIAAbierto, setModalIAAbierto] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setErrorCarga("");

        const data = await fetchDatosDueloPilotos();
        setPilotos(data.pilotos);
        setCircuitos(data.circuitos);
      } catch (err) {
        setErrorCarga(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  useEffect(() => {
    async function cargarRecomendacionIA() {
      if (
        modoCircuito !== "manual" ||
        !circuitoKey ||
        !driverNumber1
      ) {
        setRecomendacionIA(null);
        setErrorIA("");
        return;
      }

      try {
        setLoadingIA(true);
        setErrorIA("");

        const data = await fetchRecomendacionRival(
          Number(circuitoKey),
          Number(driverNumber1)
        );

        setRecomendacionIA(data);
        setModalIAAbierto(true);

      } catch (err) {
        setRecomendacionIA(null);
        setErrorIA(err.message);
      } finally {
        setLoadingIA(false);
      }
    }

    cargarRecomendacionIA();
  }, [circuitoKey, driverNumber1, modoCircuito]);

  useEffect(() => {
    if (modoRival === "aleatorio") {
      setDriverNumber2("");
    }
  }, [modoRival]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setErrorForm("");

      if (!driverNumber1) {
        throw new Error("Debes seleccionar tu piloto");
      }

      if (modoRival === "manual" && !driverNumber2) {
        throw new Error("Debes seleccionar un piloto rival");
      }

      if (modoRival === "manual" && Number(driverNumber1) === Number(driverNumber2)) {
        throw new Error("No puedes enfrentarte al mismo piloto");
      }

      if (modoCircuito === "manual" && !circuitoKey) {
        throw new Error("Debes seleccionar un circuito");
      }

      const payload = {
        modo,
        modo_rival: modoRival,
        modo_circuito: modoCircuito,
        driver_number_1: Number(driverNumber1),
      };

      if (modoRival === "manual") {
        payload.driver_number_2 = Number(driverNumber2);
      }

      if (modoCircuito === "manual") {
        payload.circuito_key = Number(circuitoKey);
      }

      onContinue(payload, pilotos);
    } catch (err) {
      setErrorForm(err.message);
      window.scrollTo({
        top: 0,
      });
    }
  }

  const rivalesDisponibles = pilotos.filter(
    (piloto) => piloto.driver_number !== Number(driverNumber1)
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      {modalIAAbierto && recomendacionIA?.rival_recomendado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalIAAbierto(false)}
        >
          <div
            className="relative bg-neutral-950 border border-[#FFEB00]/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalIAAbierto(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FFEB00] flex items-center justify-center">
                <span className="text-black font-black text-lg">🧠</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#FFEB00] font-black">
                  Team Radio
                </p>
                <h2 className="text-xl font-bold text-white">
                  Tu equipo quiere echarte una mano
                </h2>
              </div>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed mb-5">
              Hemos analizado el circuito y creemos que este rival puede darte un duelo
              más interesante y competitivo.
            </p>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-black mb-2">
                Rival recomendado
              </p>

              <h3 className="text-white text-2xl font-black italic">
                {recomendacionIA.rival_recomendado.full_name}
              </h3>

              <p className="text-neutral-400 text-sm mt-1">
                {recomendacionIA.rival_recomendado.team_name}
              </p>

              <p className="text-neutral-300 text-sm mt-4 leading-relaxed">
                {recomendacionIA.rival_recomendado.motivo}
              </p>

              <p className="mt-4 text-xs uppercase font-black tracking-widest text-[#FFEB00]">
                Nivel del duelo: {recomendacionIA.rival_recomendado.nivel_duelo}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (recomendacionIA?.rival_recomendado?.driver_number) {
                    setModoRival("manual");
                    setDriverNumber2(
                      String(recomendacionIA.rival_recomendado.driver_number)
                    );
                  }
                  setModalIAAbierto(false);
                }}
                className="flex-1 py-3 bg-[#FFEB00] text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-white transition-colors"
              >
                Aceptar rival
              </button>

              <button
                onClick={() => setModalIAAbierto(false)}
                className="flex-1 py-3 bg-neutral-900 border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-neutral-800 transition-colors"
              >
                Lo elijo yo
              </button>
            </div>
          </div>
        </div>
      )}

      
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <span className="text-[#FFEB00] font-mono text-sm tracking-[0.3em] uppercase">
            Battle Configuration
          </span>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
            Duelo de <span className="text-[#FFEB00]">Pilotos</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-neutral-900 p-2 rounded-2xl border border-neutral-800">
          <div className="px-6 py-3 rounded-xl bg-black border border-neutral-700">
            <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">
              Modo de Juego
            </p>
            <p className="text-[#FFEB00] font-black uppercase text-sm italic">
              {modo === "carrera" ? "🏁 Full Race" : "⏱️ Best Lap"}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-400 animate-pulse font-mono">
            Cargando formulario...
          </p>
        </div>
      ) : errorCarga ? (
        <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
          <p className="text-red-400 font-bold uppercase">Error: {errorCarga}</p>
        </div>
      ) : pilotos.length === 0 ? (
        <div className="bg-neutral-900 rounded-[32px] p-12 border border-neutral-800 text-center shadow-2xl">
          <div className="text-6xl mb-6">🏎️</div>
          <h2 className="text-3xl font-black text-white uppercase italic mb-4">
            Parrilla no disponible
          </h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
            No hemos encontrado pilotos disponibles para el duelo. Revisa la carga
            de datos antes de iniciar una simulación.
          </p>

          <button
            onClick={() => navigate("/duelos/pilotos")}
            className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-[#FFEB00] transition-all"
          >
            Volver
          </button>
        </div>
      ) : (

        <>
          {errorForm && (
            <div className="mb-6 flex items-center gap-3 bg-neutral-950 border border-red-500/50 rounded-2xl px-6 py-4 shadow-[0_0_20px_rgba(166,5,26,0.3)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
              <p className="text-sm font-black uppercase tracking-widest text-red-400">{errorForm}</p>
            </div>
          )}
          
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] ml-2">
                01. Player One
              </h3>
              <div className="bg-neutral-900 p-6 rounded-[32px] border-2 border-neutral-800 hover:border-[#FFEB00]/40 transition-colors group">
                <div className="aspect-video w-full bg-black rounded-2xl mb-6 overflow-hidden border border-neutral-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-800 text-xs font-mono uppercase">
                    <img src={usuario} alt="usuario" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-[10px] text-[#FFEB00] font-bold uppercase italic">
                    mi piloto
                  </div>
                </div>

                <label className="block text-[10px] text-neutral-500 font-black uppercase mb-2 ml-1">
                  Selecciona tu piloto
                </label>

                <select
                  value={driverNumber1}
                  onChange={(e) => setDriverNumber1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black text-white border border-neutral-700 focus:border-[#FFEB00] outline-none font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecciona un piloto</option>
                  {pilotos.map((piloto) => (
                    <option key={piloto.driver_number} value={piloto.driver_number}>
                      {piloto.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 pt-8">
              <div className="text-center">
                <div className="inline-block px-4 py-1 bg-neutral-800 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">
                  VS
                </div>
              </div>

              <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900 p-8 rounded-[40px] border border-neutral-700 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-center text-white font-black italic uppercase text-xl mb-6 flex items-center justify-center gap-2">
                    <span className="text-2xl">🌍</span> Localización
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setModoCircuito("manual")}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        modoCircuito === "manual"
                          ? "bg-[#FFEB00] text-black border-[#FFEB00]"
                          : "bg-black text-neutral-500 border-neutral-800"
                      }`}
                    >
                      Selección
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoCircuito("aleatorio")}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        modoCircuito === "aleatorio"
                          ? "bg-[#FFEB00] text-black border-[#FFEB00]"
                          : "bg-black text-neutral-500 border-neutral-800"
                      }`}
                    >
                      Random
                    </button>
                  </div>

                  {modoCircuito === "manual" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="aspect-square w-32 mx-auto bg-black rounded-full border-4 border-neutral-800 flex items-center justify-center overflow-hidden">
                        <img src={circuitosFoto} alt="circuitos" />
                      </div>
                      <select
                        value={circuitoKey}
                        onChange={(e) => setCircuitoKey(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-black text-white border border-neutral-700 focus:border-[#FFEB00] outline-none font-bold transition-all text-sm"
                      >
                        <option value="">Elegir Pista...</option>
                        {circuitos.map((c) => (
                          <option key={c.circuit_key} value={c.circuit_key}>
                            🚩 {c.circuit_short_name}
                          </option>
                        ))}
                      </select>

                      {loadingIA && (
                        <div className="mt-4 bg-black border border-neutral-800 rounded-2xl p-4">
                          <p className="text-sm text-neutral-400 font-mono">
                            Analizando circuito y piloto con IA...
                          </p>
                        </div>
                      )}

                      {errorIA && (
                        <div className="mt-4 bg-red-900/20 border border-red-500 rounded-2xl p-4">
                          <p className="text-sm text-red-400 font-bold">
                            {errorIA}
                          </p>
                        </div>
                      )}

                      {recomendacionIA?.rival_recomendado && (
                        <div className="mt-4 bg-neutral-950 border border-[#FFEB00]/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(255,235,0,0.08)]">
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#FFEB00] mb-2">
                            Recomendación IA
                          </p>
                          <h4 className="text-white font-black text-lg italic">
                            {recomendacionIA.rival_recomendado.full_name}
                          </h4>
                          <p className="text-neutral-400 text-sm mt-1">
                            {recomendacionIA.rival_recomendado.team_name}
                          </p>
                          <p className="text-neutral-300 text-sm mt-3 leading-relaxed">
                            {recomendacionIA.rival_recomendado.motivo}
                          </p>
                          <p className="text-xs text-neutral-500 mt-3 uppercase">
                            Nivel del duelo: {recomendacionIA.rival_recomendado.nivel_duelo}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {modoCircuito === "aleatorio" && (
                    <div className="py-10 text-center animate-pulse">
                      <span className="text-4xl">🎲</span>
                      <p className="text-neutral-500 text-[10px] uppercase font-bold mt-2 tracking-tighter text-wrap">
                        El sistema elegirá un circuito al azar
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full group bg-[#FFEB00] hover:bg-white p-5 rounded-[24px] shadow-[0_15px_30px_-10px_rgba(255,235,0,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="text-black font-black uppercase italic tracking-widest text-sm">
                  Configurar Neumático
                </span>
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </button>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] ml-2 text-right">
                02. Opponent
              </h3>
              <div className="bg-neutral-900 p-6 rounded-[32px] border-2 border-neutral-800 hover:border-red-600/40 transition-colors group">
                <div className="aspect-video w-full bg-black rounded-2xl mb-6 overflow-hidden border border-neutral-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-800 text-xs font-mono uppercase italic">
                    <img src={rival} alt="rival" />
                  </div>
                  <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded text-[10px] text-white font-black uppercase italic">
                    Target
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setModoRival("manual")}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                      modoRival === "manual"
                        ? "bg-white text-black"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    ESPECÍFICO
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoRival("aleatorio")}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                      modoRival === "aleatorio"
                        ? "bg-white text-black"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    RANDOM
                  </button>
                </div>

                {modoRival === "manual" ? (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] text-neutral-500 font-black uppercase mb-2 ml-1 text-right">
                      Escoge tu enemigo
                    </label>
                    <select
                      value={driverNumber2}
                      onChange={(e) => setDriverNumber2(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-black text-white border border-neutral-700 focus:border-red-600 outline-none font-bold transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Seleccionar Rival --</option>
                      {rivalesDisponibles.map((piloto) => (
                        <option
                          key={piloto.driver_number}
                          value={piloto.driver_number}
                        >
                          💀 {piloto.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="h-[76px] flex items-center justify-center bg-black/40 rounded-2xl border border-dashed border-neutral-800 italic text-neutral-600 text-xs">
                    Rival aleatorio activado...
                  </div>
                )}
              </div>
            </div>
          </form>
        </>
      )}

      <div className="mt-12 text-center">
        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em]">
          Sistema: Listo para correr
        </p>
      </div>
    </section>
  );
}
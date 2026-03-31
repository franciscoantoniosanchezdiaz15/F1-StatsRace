import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchPilotosDisponiblesEscuderia, crearEscuderia} 
from "../services/escuderiaService";

const getEstilosPiloto = (seleccionado, puedeSeleccionar) => {
  const base = "relative overflow-hidden rounded-[24px] p-6 border-2 transition-all duration-300 cursor-pointer";
  
  if (seleccionado) {
    return `${base} bg-[#FFEB00] border-[#FFEB00] text-black scale-105 shadow-[0_10px_30px_rgba(255,235,0,0.2)]`;
  }
  
  if (puedeSeleccionar) {
    return `${base} bg-neutral-900 border-neutral-800 text-white hover:border-neutral-600`;
  }
  
  return `${base} bg-neutral-900 border-neutral-800 text-neutral-600 opacity-50 grayscale cursor-not-allowed`;
};

export default function CrearEscuderiaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [pilotosDisponibles, setPilotosDisponibles] = useState([]);
  const [pilotosSeleccionados, setPilotosSeleccionados] = useState([]);
  const [presupuestoMax, setPresupuestoMax] = useState(100);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPilotos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchPilotosDisponiblesEscuderia();
        setPilotosDisponibles(data.pilotos);
        setPresupuestoMax(data.presupuesto_max);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPilotos();
  }, []);

  function togglePiloto(driverNumber) {
    if (pilotosSeleccionados.includes(driverNumber)) {
      setPilotosSeleccionados(
        pilotosSeleccionados.filter((num) => num !== driverNumber)
      );
      return;
    }

    if (pilotosSeleccionados.length >= 2) {
      return;
    }

    setPilotosSeleccionados([...pilotosSeleccionados, driverNumber]);
  }

  const pilotosSeleccionadosData = pilotosDisponibles.filter((piloto) =>
    pilotosSeleccionados.includes(piloto.driver_number)
  );

  const costeActual = pilotosSeleccionadosData.reduce(
    (acc, piloto) => acc + piloto.precio,
    0
  );

  const presupuestoRestante = presupuestoMax - costeActual;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await crearEscuderia({
        nombre,
        pilotos: pilotosSeleccionados,
      });

      navigate("/escuderias");
    } catch (err) {
      setError(err.message);
      window.scrollTo({
        top: 0
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[#FFEB00] font-mono text-xs uppercase tracking-[0.3em]">nuevos ganadores</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              Fundar <span className="text-[#FFEB00]">Escudería</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
            <StatCard  label="Restante" value={`${presupuestoRestante}M`} color={presupuestoRestante < 10 ? "text-red-500" : "text-green-400"} />
            <StatCard label="Pilotos" value={`${pilotosSeleccionados.length}/2`} color={pilotosSeleccionados.length === 2 ? "text-[#FFEB00]" : "text-white"} />
            <div className="hidden md:block">
                <StatCard  label="Estado" value={presupuestoRestante >= 0 ? "Válido" : "Excedido"} color="text-blue-400" />
            </div>
          </div>
        </div>

       {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando circuitos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-12">

            <div className="relative group max-w-2xl">
              <label className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2 block ml-1">Official Team Name</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-[#FFEB00] px-6 py-4 rounded-2xl text-xl font-bold italic outline-none transition-all placeholder:text-neutral-700"
                placeholder="Ej: Ten Gris"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Selecciona tu alineación</h3>
                <span className="text-[10px] text-neutral-600 font-mono">Market Update: Live</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grig-cols-4 gap-6">
                {pilotosDisponibles.map((piloto) => {
                  const seleccionado = pilotosSeleccionados.includes(piloto.driver_number);
                  const puedeSeleccionar = pilotosSeleccionados.length < 2 || seleccionado;

                  return (
                    <div
                      key={piloto.driver_number}
                      onClick={() => togglePiloto(piloto.driver_number, piloto.precio)}
                      className={getEstilosPiloto(seleccionado, puedeSeleccionar)}
                    >
                      
                      <div className="mb-4">
                          <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">{piloto.full_name}</h2>
                          <p className={`text-[10px] font-bold uppercase mt-1 ${seleccionado ? 'text-black/60' : 'text-neutral-500'}`}>{piloto.team_name}</p>
                      </div>

                      <div className={`pt-4 border-t ${seleccionado ? 'border-black/20' : 'border-neutral-800'} flex justify-between items-center`}>
                          <span className="text-[10px] font-black uppercase tracking-widest">Market Value</span>
                          <span className="text-lg font-black italic">{piloto.precio}M</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sticky bottom-6 left-0 right-0 z-50">
                <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-700 p-6 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-[10px] text-neutral-500 font-black uppercase mb-1">Inversión Total</p>
                            <p className={`text-2xl font-black italic ${costeActual > presupuestoMax ? 'text-red-500' : 'text-white'}`}>{costeActual} / {presupuestoMax}M</p>
                        </div>
                        <div className="h-10 w-[1px] bg-neutral-800 hidden md:block"></div>
                        <div className="hidden md:block">
                            <p className="text-[10px] text-neutral-500 font-black uppercase mb-1">Lineup</p>
                            {/* para poner los dos puntos q se ponen amarilllo cuando selecciono un piloto */}
                            <div className="flex gap-2">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${i < pilotosSeleccionados.length ? 'bg-[#FFEB00]' : 'bg-neutral-700'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || pilotosSeleccionados.length !== 2 || costeActual > presupuestoMax}
                        className={`
                            px-12 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all
                            ${saving || pilotosSeleccionados.length !== 2 || costeActual > presupuestoMax
                                ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                                : "bg-[#FFEB00] text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,235,0,0.4)]"}
                        `}
                    >
                        {saving ? "Registrando..." : "Confirmar Escudería"}
                    </button>
                </div>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl min-w-[100px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-lg font-black italic leading-none ${color}`}>{value}</p>
    </div>
  );
}
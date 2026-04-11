import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { useRequireAuth } from "../hooks/useRequireAuth";

function renderEstadoCarrera(piloto){
  if(!piloto.valido){
    return "NF";
  }
  return `P${piloto.position}`;
}


function EscuderiaDetalleCard({ escuderia, esCarrera, esUsuario }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border ${esUsuario ? 'border-[#FFEB00]/30 bg-neutral-900' : 'border-neutral-800 bg-neutral-900/50'} p-6 shadow-2xl`}>
      <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest ${esUsuario ? 'bg-[#FFEB00] text-black' : 'bg-neutral-700 text-white'}`}>
        {esUsuario ? "Tu Escudería" : "Rival"}
      </div>
      
      <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
        {escuderia.nombre}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-black/40 p-3 rounded-2xl border border-neutral-800">
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Inversión</p>
          <p className="text-lg font-bold text-white">{escuderia.coste_total}M</p>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-neutral-800">
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Bonus Química</p>
          <p className="text-lg font-bold text-[#FFEB00]">{escuderia.bonus_quimica}</p>
        </div>
      </div>

      <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-800 pb-2">Lineup Telemetry</h3>

      <div className="space-y-3">
        {escuderia.pilotos.map((piloto) => (
          <div
            key={piloto.driver_number}
            className="group bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700/50 hover:border-neutral-500 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-black italic uppercase tracking-tight">{piloto.full_name}</p>
                <p className="text-[10px] text-neutral-500 font-bold uppercase">{piloto.team_name}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black italic ${piloto.valido ? 'text-white' : 'text-red-500'}`}>
                  {esCarrera ? renderEstadoCarrera(piloto) : (piloto.valor ?? "---")}
                </p>
                <p className="text-[9px] text-neutral-500 font-bold uppercase">{esCarrera ? 'Posición' : 'Mejor Vuelta'}</p>
              </div>
            </div>

            {esUsuario && (
              <div className="mt-3 pt-3 border-t border-neutral-700 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${piloto.acierto_compuesto ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Elección</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-white px-2 py-0.5 bg-black rounded uppercase tracking-tighter">
                      {piloto.compuesto_elegido}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-8 p-4 rounded-2xl text-center ${esUsuario ? 'bg-[#FFEB00]' : 'bg-white'}`}>
        <p className="text-[10px] text-black/60 font-black uppercase tracking-[0.2em]">{esCarrera ? "Puntuación Final" : "Tiempo Total"}</p>
        <p className="text-3xl font-black italic text-black tracking-tighter uppercase">{escuderia.valor_final}</p>
      </div>

    </div>
  );
}

export default function DueloEscuderiasResultadoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useRequireAuth();

  const resultado = location.state?.resultado;

  if (!resultado) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-500 font-black uppercase tracking-widest mb-6">No hay resultado disponible.</p>
            <button
              onClick={() => navigate("/duelos/escuderias")}
              className="px-8 py-3 bg-[#FFEB00] text-black font-black uppercase tracking-widest rounded-full"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const esCarrera = resultado.modo === "carrera";
  const ganoUsuario = resultado.resultado.ganador === resultado.escuderia_usuario.nombre;

  if (loading || !isAuthenticated) return null;

  return (
    <div>
      <Navbar />

      <div>
       <section className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className={`mb-6 p-4 rounded-full ${ganoUsuario ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} animate-bounce`}>
              {ganoUsuario ? "Win" : "Defeat"}
            </div>
            <h1 className="text-6xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">
              {ganoUsuario ? <span className="text-green-500">Victory</span> : <span className="text-red-500">Defeat</span>}
            </h1>
            <p className="text-neutral-500 font-black uppercase tracking-[0.4em] mb-12">Race Classification Finalized</p>

            <div className="flex items-center gap-8 md:gap-20 bg-neutral-900/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
                <div className="text-center">
                  <p className="text-[10px] text-neutral-500 font-black uppercase mb-1 tracking-widest">Tu Resultado</p>
                  <p className="text-4xl font-black italic tracking-tighter">{resultado.resultado.tiempo_usuario}</p>
                </div>
                <div className="text-5xl font-black italic text-[#FFEB00] opacity-20 italic underline">VS</div>
                <div className="text-center">
                  <p className="text-[10px] text-neutral-500 font-black uppercase mb-1 tracking-widest">Rival</p>
                  <p className="text-4xl font-black italic tracking-tighter text-neutral-400">{resultado.resultado.tiempo_rival}</p>
                </div>
            </div>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 mt-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <InfoBadge  label="Circuito" value={resultado.circuito.circuit_short_name} />
          <InfoBadge  label="Modo" value={resultado.modo} />
          <InfoBadge  label="Diferencia" value={resultado.resultado.diferencia} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <EscuderiaDetalleCard escuderia={resultado.escuderia_usuario} esCarrera={esCarrera} esUsuario={true} />
          <EscuderiaDetalleCard escuderia={resultado.escuderia_rival} esCarrera={esCarrera} esUsuario={false} />
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/duelos/escuderias")}
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#FFEB00] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,235,0,0.2)]"
          >
            Nuevo Duelo
          </button>
          
          <button
            onClick={() => navigate("/duelos/escuderias/historial")}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-neutral-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-700 transition-all border border-neutral-700"
          >
             Historial
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoBadge({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 bg-neutral-900 border border-white/5 px-6 py-3 rounded-full">
            <span className="text-[#FFEB00]">{icon}</span>
            <div className="flex flex-col">
              <span className="text-[8px] text-neutral-500 font-black uppercase leading-none mb-1 tracking-tighter">{label}</span>
              <span className="text-xs font-black uppercase italic leading-none">{value}</span>
            </div>
        </div>
    );
}
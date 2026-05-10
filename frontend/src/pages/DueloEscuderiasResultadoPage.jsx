import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { useRequireAuth } from "../hooks/useRequireAuth";

function renderEstadoCarrera(piloto){
  if(!piloto.valido){
    return "NF";
  }
  return `P${piloto.position}`;
}

function getCompuestoColor(compuesto) {
  const c = (compuesto || "").toUpperCase();
  if (c === "SOFT") return "bg-red-500 text-white";
  if (c === "MEDIUM") return "bg-yellow-400 text-black";
  return "bg-white text-black";
}

function CompuestoBadge({ compuesto }) {
  if (!compuesto) return <span className="text-neutral-600 text-[10px] font-black uppercase">NF</span>;
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getCompuestoColor(compuesto)}`}>
      {compuesto}
    </span>
  );
}

function getBonusDisplayValue(valor, esCarrera, aciertoCompuesto = null) {
  const n = Math.abs(Number(valor || 0));

  if (esCarrera) {
    return Number(valor || 0);
  }

  // mejor-tiempo:
  // si acierta => reduce tiempo => mostrar negativo
  // si falla => penaliza => mostrar positivo
  if (aciertoCompuesto === true) return -n;
  if (aciertoCompuesto === false) return n;

  return -n;
}

function formatBonus(valor, esCarrera, aciertoCompuesto = null) {
  const display = getBonusDisplayValue(valor, esCarrera, aciertoCompuesto);

  if (display > 0) return `+${display}`;
  if (display < 0) return `${display}`;
  return "0";
}

function getBonusColor(valor, esCarrera, aciertoCompuesto = null) {
  if (aciertoCompuesto == null) return "text-neutral-500";

  if (esCarrera) {
    const n = Number(valor || 0);
    if (n > 0) return "text-green-400";
    if (n < 0) return "text-red-400";
    return "text-neutral-500";
  }

  // mejor-tiempo:
  // acierto => verde
  // fallo => rojo
  if (aciertoCompuesto === true) return "text-green-400";
  if (aciertoCompuesto === false) return "text-red-400";
 
  const n = Number(valor || 0);
  return n !== 0 ? "text-green-400" : "text-neutral-500"; 
}

function getTotalBonusColor(valor, esCarrera) {
  const n = Number(valor || 0);

  if (esCarrera) {
    if (n > 0) return "text-green-400";
    if (n < 0) return "text-red-400";
    return "text-neutral-500";
  }

  // mejor-tiempo:
  // negativo = beneficio
  // positivo = penalización
  if (n < 0) return "text-green-400";
  if (n > 0) return "text-red-400";
  return "text-neutral-500";
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
          <p className={`text-lg font-bold ${getBonusColor(escuderia.bonus_quimica, esCarrera)}`}>
            {formatBonus(escuderia.bonus_quimica, esCarrera)} {esCarrera ? "pts" : "s"}
          </p>
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
                  {esCarrera ? renderEstadoCarrera(piloto) : (piloto.valor)}
                </p>
                <p className="text-[9px] text-neutral-500 font-bold uppercase">{esCarrera ? 'Posición' : 'Mejor Vuelta'}</p>
              </div>
            </div>

            {esUsuario && (
              <div className="mt-3 pt-3 border-t border-neutral-700 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Elegido</span>
                      <CompuestoBadge compuesto={piloto.compuesto_elegido} />
                    </div>
                    <span className="text-neutral-600 text-xs">→</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Real</span>
                      <CompuestoBadge compuesto={piloto.compuesto_real} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${piloto.acierto_compuesto == null ? "bg-neutral-500" : piloto.acierto_compuesto ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-xs font-black tabular-nums ${getBonusColor(piloto.bonus_compuesto, esCarrera, piloto.acierto_compuesto)}`}>
                      {piloto.acierto_compuesto == null ? "NF" : formatBonus(piloto.bonus_compuesto, esCarrera, piloto.acierto_compuesto)}
                    </span>
                    <span className="text-[9px] text-neutral-600 font-black uppercase">
                      {esCarrera ? "pts" : "s"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Boxes</span>

                    <span className="text-white text-xs font-black">
                      {piloto.paradas_elegidas}
                    </span>

                    <span className="text-neutral-600 text-xs">→</span>

                    <span className="text-white text-xs font-black">
                      {piloto.paradas_reales}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${piloto.acierto_paradas == null ? "bg-neutral-500" : piloto.acierto_paradas ? "bg-green-500" : "bg-red-500"}`}/>

                    <span className={`text-xs font-black tabular-nums ${getBonusColor(piloto.bonus_paradas, esCarrera, piloto.acierto_paradas)}`}>
                      {piloto.acierto_paradas == null ? "NF" : formatBonus( piloto.bonus_paradas, esCarrera, piloto.acierto_paradas)}
                    </span>

                    <span className="text-[9px] text-neutral-600 font-black uppercase">
                      {esCarrera ? "pts" : "s"}
                    </span>
                  </div>
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

function BonificacionesPanel({ bonificaciones, esCarrera }) {
  if (!bonificaciones) return null;

  const totalCompuestos = bonificaciones.pilotos.reduce(
    (acc, p) =>
      acc + getBonusDisplayValue(p.bonus_compuesto, esCarrera, p.acierto_compuesto),
    0
  );

  const totalParadas = bonificaciones.pilotos.reduce(
    (acc, p) =>
      acc + getBonusDisplayValue(p.bonus_paradas, esCarrera, p.acierto_paradas),
    0
  );

  const bonusQuimicaDisplay = getBonusDisplayValue(bonificaciones.bonus_quimica, esCarrera);
  const totalBonos = bonusQuimicaDisplay + totalCompuestos + totalParadas;
  const unidad = esCarrera ? "pts" : "s";

  return (
    <div className="max-w-2xl mx-auto mb-12 rounded-3xl border border-[#FFEB00]/20 bg-neutral-900 p-6 shadow-xl">
      <h3 className="text-xs font-black text-[#FFEB00] uppercase tracking-[0.4em] mb-5 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#FFEB00] rounded-full inline-block" />
        Resumen de Bonificaciones
      </h3>

      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-2xl border border-neutral-800">
          <div>
            <p className="text-white text-xs font-black uppercase tracking-tight">Química de equipo</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">
              Bonus por escudería equilibrada
            </p>
          </div>
          <span className={`text-sm font-black tabular-nums ${getBonusColor(bonificaciones.bonus_quimica, esCarrera)}`}>
            {formatBonus(bonificaciones.bonus_quimica, esCarrera)} {unidad}
          </span>
        </div>

        {bonificaciones.pilotos.map((piloto) => (
          <div
            key={piloto.driver_number}
            className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-2xl border border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${piloto.acierto_compuesto == null ? "bg-neutral-500" : piloto.acierto_compuesto ? 'bg-green-500' : 'bg-red-400'}`} />
              <div>
                <p className="text-white text-xs font-black uppercase tracking-tight">{piloto.full_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CompuestoBadge compuesto={piloto.compuesto_elegido} />
                  <span className="text-neutral-600 text-[10px]">→</span>
                  <CompuestoBadge compuesto={piloto.compuesto_real} />
                  <span className={`text-[9px] font-black uppercase ml-1 ${piloto.acierto_compuesto == null ? "bg-neutral-500" : piloto.acierto_compuesto ? 'text-green-500' : 'text-red-400'}`}>
                    {piloto.acierto_compuesto == null ? "NF" : piloto.acierto_compuesto ? "Acierto" : "Fallo"}
                  </span>
                </div>
              </div>
            </div>
            <span className={`text-sm font-black tabular-nums ${getBonusColor(piloto.bonus_compuesto, esCarrera, piloto.acierto_compuesto)}`}>
              {piloto.acierto_compuesto == null ? "NF" : formatBonus(piloto.bonus_compuesto, esCarrera, piloto.acierto_compuesto)}{" "} {unidad}
            </span>

            <div className="flex items-center justify-between border-neutral-800 pt-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${ piloto.acierto_paradas == null ? "bg-neutral-500" : piloto.acierto_paradas ? "bg-green-500" : "bg-red-400"}`}/>

                <div>
                  <p className="text-white text-xs font-black uppercase tracking-tight">
                    Paradas en boxes
                  </p>

                  <p className="text-[9px] text-neutral-500 font-black uppercase mt-0.5">
                    Elegidas {piloto.paradas_elegidas} → Reales{" "} {piloto.paradas_reales}
                  </p>
                </div>
              </div>

              <span className={`text-sm font-black tabular-nums ${getBonusColor(piloto.bonus_paradas, esCarrera, piloto.acierto_paradas)}`}>
                {piloto.acierto_paradas == null ? "NF" : formatBonus( piloto.bonus_paradas, esCarrera, piloto.acierto_paradas)}{" "}
                {unidad}
              </span>
            </div>

          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Total bonificado</p>
        <span className={`text-xl font-black tabular-nums ${getTotalBonusColor(parseFloat(totalBonos.toFixed(3)), esCarrera)}`}>
          {totalBonos > 0 ? "+" : ""}{parseFloat(totalBonos.toFixed(3))} {unidad}
        </span>
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
  const bonificaciones = resultado.resultado.bonificaciones_usuario;

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

        <BonificacionesPanel bonificaciones={bonificaciones} esCarrera={esCarrera} />

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
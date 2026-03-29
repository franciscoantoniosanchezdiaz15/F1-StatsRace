import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

function renderEstadoCarrera(piloto){
  if(!piloto.valido){
    return "NF";
  }
  return `P${piloto.position}`;
}


function EscuderiaDetalleCard({ escuderia, esCarrera, esUsuario }) {
  return (
    <div className="bg-neutral-800 rounded-xl p-5">
      <h2 className="text-2xl font-bold text-white mb-3">
        {escuderia.nombre}
      </h2>

      <div className="space-y-2 text-gray-300 mb-5">
        <p>
          <strong>Coste total:</strong> {escuderia.coste_total}
        </p>
        <p>
          <strong>
            {esCarrera ? "Puntos extras por quimica" : "Tiempo reducido por quimica"}
          </strong>{" "} 
          {escuderia.bonus_quimica}
        </p>
        <p>
          <strong>
            {esCarrera ? "Puntuación final:" : "Tiempo final:"}
          </strong>{" "}
          {escuderia.valor_final}
        </p>
      </div>

      <h3 className="text-lg font-bold text-white mb-3">Pilotos</h3>

      <div className="space-y-3">
        {escuderia.pilotos.map((piloto) => (
          <div
            key={piloto.driver_number}
            className="bg-neutral-900 rounded-lg p-4 border border-neutral-700"
          >
            <p className="text-white font-bold">{piloto.full_name}</p>
            <p className="text-gray-400">{piloto.team_name}</p>
            <p className="text-gray-400">Precio: {piloto.precio}</p>

            {esCarrera ? (
              <>
                <p className="text-gray-300">
                  Puesto: {renderEstadoCarrera(piloto)}
                </p>
                <p className="text-gray-300">
                  Puntos: {piloto.valor}
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-300">
                  Mejor vuelta: {piloto.valor ?? "Sin tiempo"}
                </p>
                <p className="text-gray-300">
                  Válido: {piloto.valido ? "Sí" : "No"}
                </p>
              </>
            )}

            {esUsuario && (
              <>
                <p className="text-gray-300">
                  Estrategia de neumaticos
                </p>
                <p className="text-gray-300">
                  Bonus compuesto: {piloto.bonus_compuesto}
                </p>
                <p className="text-gray-300">
                  Compuesto elegido: {piloto.compuesto_elegido ?? "No elegido"}
                </p>
                <p className="text-gray-300">
                  Compuesto real: {piloto.compuesto_real ?? "No disponible"}
                </p>
                <p className="text-gray-300">
                  Acierto compuesto: {piloto.acierto_compuesto ? "Sí" : "No"}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DueloEscuderiasResultadoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultado = location.state?.resultado;

  if (!resultado) {
    return (
      <div>
        <Navbar />
        <section className="max-w-5xl mx-auto px-10 py-10">
          <p className="text-red-400 mb-4">No hay resultado disponible.</p>
          <button
            onClick={() => navigate("/duelos/escuderias")}
            className="px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
          >
            Volver
          </button>
        </section>
      </div>
    );
  }

  const esCarrera = resultado.modo === "carrera";

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate("/duelos/escuderias")}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>

        <article className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 shadow-lg">
          <h1 className="text-4xl font-bold text-[#FFEB00] mb-8">
            Resultado del duelo
          </h1>

          <div className="space-y-4 text-gray-200 text-lg mb-8">
            <p><strong>Modo:</strong> {resultado.modo}</p>
            <p><strong>Tipo de rival:</strong> {resultado.tipo_rival}</p>
            <p><strong>Circuito:</strong> {resultado.circuito.circuit_short_name}</p>
            <p><strong>Ganador:</strong> {resultado.resultado.ganador}</p>

            {esCarrera ? (
              <>
                <p><strong>Puntos tu escudería:</strong> {resultado.resultado.tiempo_usuario}</p>
                <p><strong>Puntos rival:</strong> {resultado.resultado.tiempo_rival}</p>
                <p><strong>Diferencia de puntos:</strong> {resultado.resultado.diferencia}</p>
              </>
            ) : (
              <>
                <p><strong>Tiempo tu escudería:</strong> {resultado.resultado.tiempo_usuario}</p>
                <p><strong>Tiempo rival:</strong> {resultado.resultado.tiempo_rival}</p>
                <p><strong>Diferencia:</strong> {resultado.resultado.diferencia}</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EscuderiaDetalleCard escuderia={resultado.escuderia_usuario} esCarrera={esCarrera} esUsuario={true}/>
            <EscuderiaDetalleCard escuderia={resultado.escuderia_rival} esCarrera={esCarrera} esUsuario={false}/>
          </div>

          <button
            onClick={() => navigate("/duelos/escuderias/historial")}
            className="mt-8 px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
          >
            Ver historial
          </button>
        </article>
      </section>
    </div>
  );
}
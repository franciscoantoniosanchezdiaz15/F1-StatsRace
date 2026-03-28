import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

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
            <div className="bg-neutral-800 rounded-xl p-5">
              <h2 className="text-2xl font-bold text-white mb-4">
                {resultado.escuderia_usuario.nombre}
              </h2>

              <ul className="space-y-2 text-gray-300">
                {resultado.escuderia_usuario.pilotos.map((piloto) => (
                  <li key={piloto.driver_number}>
                    {piloto.full_name} - {piloto.team_name} ({piloto.precio})
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-800 rounded-xl p-5">
              <h2 className="text-2xl font-bold text-white mb-4">
                {resultado.escuderia_rival.nombre}
              </h2>

              <ul className="space-y-2 text-gray-300">
                {resultado.escuderia_rival.pilotos.map((piloto) => (
                  <li key={piloto.driver_number}>
                    {piloto.full_name} - {piloto.team_name} ({piloto.precio})
                  </li>
                ))}
              </ul>
            </div>
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
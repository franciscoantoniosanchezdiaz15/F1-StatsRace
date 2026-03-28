import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import {
  fetchHistorialDuelosEscuderia,
  eliminarDueloEscuderia,
} from "../services/dueloEscuderiasService";

export default function DueloEscuderiasHistorialPage() {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarHistorial() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchHistorialDuelosEscuderia();
      setHistorial(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function handleEliminar(id) {
    try {
      await eliminarDueloEscuderia(id);
      await cargarHistorial();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-6xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate("/duelos/escuderias")}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>

        <h1 className="text-4xl font-bold text-[#FFEB00] mb-8">
          Historial de duelos de escuderías
        </h1>

        {loading && <p className="text-white">Cargando historial...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && historial.length === 0 && (
          <p className="text-gray-300">No hay duelos guardados.</p>
        )}

        {!loading && !error && historial.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {historial.map((duelo) => (
              <article
                key={duelo.id}
                className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  {duelo.escuderia_usuario_nombre} vs {duelo.escuderia_rival_nombre}
                </h2>

                <div className="space-y-2 text-gray-300 mb-4">
                  <p><strong>Modo:</strong> {duelo.modo}</p>
                  <p><strong>Tipo rival:</strong> {duelo.tipo_rival}</p>
                  <p><strong>Circuito:</strong> {duelo.circuito}</p>
                  <p><strong>Ganador:</strong> {duelo.ganador}</p>
                  <p><strong>Diferencia:</strong> {duelo.diferencia}</p>
                </div>

                <button
                  onClick={() => handleEliminar(duelo.id)}
                  className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchEscuderiaDetalle } from "../services/escuderiaService";

export default function EscuderiaDetallePage() {
  const { escuderia_id } = useParams();
  const navigate = useNavigate();

  const [escuderia, setEscuderia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEscuderiaDetalle(escuderia_id);
        setEscuderia(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [escuderia_id]);

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate("/escuderias")}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>

        {loading && <p className="text-white">Cargando detalle...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && escuderia && (
          <article className="bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-700">
            <h1 className="text-4xl font-bold text-[#FFEB00] mb-6">
              {escuderia.nombre}
            </h1>

            <div className="space-y-3 text-gray-200 text-lg mb-8">
              <p><strong>Presupuesto máximo:</strong> {escuderia.presupuesto_max}</p>
              <p><strong>Coste total:</strong> {escuderia.coste_total}</p>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Pilotos de la escudería
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {escuderia.pilotos.map((piloto) => (
                <div
                  key={piloto.id}
                  className="bg-neutral-800 p-4 rounded-lg"
                >
                  <p className="text-white font-bold">{piloto.full_name}</p>
                  <p className="text-gray-400">{piloto.team_name}</p>
                  <p className="text-gray-300">Precio: {piloto.precio}</p>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
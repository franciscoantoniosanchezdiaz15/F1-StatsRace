import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchMisEscuderias, eliminarEscuderia } from "../services/escuderiaService";

export default function EscuderiasPage() {
  const navigate = useNavigate();

  const [escuderias, setEscuderias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarEscuderias() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchMisEscuderias();
      setEscuderias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarEscuderias();
  }, []);

  async function handleEliminar(id) {
    try {
      await eliminarEscuderia(id);
      await cargarEscuderias();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#FFEB00]">
            Mis Escuderías
          </h1>

          <button
            onClick={() => navigate("/escuderias/crear")}
            className="px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
          >
            Crear escudería
          </button>

          <button
            onClick={() => navigate("/duelos/escuderias")}
            className="px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
          >
            Competir
          </button>

        </div>

        {loading && <p className="text-white">Cargando escuderías...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && escuderias.length === 0 && (
          <p className="text-gray-300">Aún no has creado ninguna escudería.</p>
        )}

        {!loading && !error && escuderias.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {escuderias.map((escuderia) => (
              <article
                key={escuderia.id}
                className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  {escuderia.nombre}
                </h2>

                <p className="text-gray-300 mb-2">
                  <strong>Presupuesto:</strong> {escuderia.presupuesto_max}
                </p>

                <p className="text-gray-300 mb-4">
                  <strong>Coste total:</strong> {escuderia.coste_total}
                </p>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Pilotos
                  </h3>

                  <ul className="text-gray-300 space-y-1">
                    {escuderia.pilotos.map((piloto) => (
                      <li key={piloto.id}>
                        {piloto.full_name} - {piloto.team_name} ({piloto.precio})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/escuderias/${escuderia.id}`)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    Ver detalle
                  </button>

                  <button
                    onClick={() => handleEliminar(escuderia.id)}
                    className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
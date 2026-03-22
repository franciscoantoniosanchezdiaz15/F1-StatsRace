import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchCircuitoDetalle } from "../services/circuitoService";
import { getCircuito } from "../utils/getCircuito";


export default function CircuitoDetalle() {
  const { circuito_key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = location.state?.page || 1;

  const [circuito, setCircuito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCircuitoDetalle(circuito_key);
        setCircuito(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [circuito_key]);

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 py-10">

        {loading && <p className="text-white">Cargando detalle del circuito...</p>}

        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && circuito && (
          <article className="bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-700">
            <h1 className="text-4xl font-bold text-[#FFEB00] mb-6">
              {circuito.circuit_short_name}
            </h1>

            <div className="space-y-3 text-gray-200 text-lg">
              <p><strong>ID circuito:</strong> {circuito.circuit_key}</p>
              <p><strong>País:</strong> {circuito.country_name}</p>
              <p><strong>Código país:</strong> {circuito.country_code}</p>
              <p><strong>Localización:</strong> {circuito.location}</p>
              <p><strong>Fecha de carrera:</strong> {circuito.date_start || "—"}</p>
              <p><strong>Session key:</strong> {circuito.session_key}</p>
            </div>

          </article>
        )}
      </section>

      <button
        onClick={() => navigate(`/circuitos?page=${page}`)}
        className="mt-10 px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-50 transition-all duration-300 hover:bg-yellow-300 hover:scale-105 cursor-pointer font-bold"
      >
        ← Volver
      </button>

    </div>
  );
}
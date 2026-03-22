import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchCircuitos } from "../services/circuitoService";
import { getCircuito } from "../utils/getCircuito";

export default function CircuitosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const [circuitos, setCircuitos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCircuitos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCircuitos(page);
        setCircuitos(data.circuitos);
        setPaginacion(data.paginacion);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarCircuitos();
  }, [page]);

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-6">
        <h1 className="text-4xl font-bold text-[#FFEB00] mb-10">
          Circuitos
        </h1>

        {loading && <p className="text-white">Cargando circuitos...</p>}

        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && circuitos.length === 0 && (
          <p className="text-gray-300">No hay circuitos disponibles.</p>
        )}

        {!loading && !error && circuitos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {circuitos.map((circuito) => (
                <article
                  key={circuito.circuit_key}
                  onClick={() => navigate(`/circuitos/${circuito.circuit_key}`, {state: { page }})}
                  className="bg-neutral-900 rounded-xl p-5 shadow-lg border border-neutral-700 animate-fade-in transition-all duration-300 ease-out
                    hover:scale-[1.04] hover:-translate-y-2
                    hover:border-yellow-400
                    hover:shadow-2xl hover:shadow-yellow-400/20
                    group cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-yellow-400">
                    {circuito.circuit_short_name}
                  </h2>

                  <img
                    src={getCircuito(circuito.circuit_key)} 
                    alt={circuito.location}
                    className="w-full h-[300px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                  />

                  {/* <p className="text-gray-300 mb-2">
                    <strong>País:</strong> {circuito.country_name}
                  </p>

                  <p className="text-gray-300 mb-2">
                    <strong>Código país:</strong> {circuito.country_code}
                  </p>

                  <p className="text-gray-300 mb-2">
                    <strong>Localización:</strong> {circuito.location}
                  </p>

                  <p className="text-gray-300">
                    <strong>Fecha:</strong> {circuito.date_start || "—"}
                  </p> */}
                </article>
              ))}
            </div>

            {paginacion && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setSearchParams({ page: page - 1 })}
                  disabled={!paginacion.anterior}
                  className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="text-white">
                  Página {paginacion.page} de {paginacion.total_pages}
                </span>

                <button
                  onClick={() => setSearchParams({ page: page + 1 })}
                  disabled={!paginacion.siguiente}
                  className="px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
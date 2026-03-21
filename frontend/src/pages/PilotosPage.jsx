import { useEffect, useState } from "react";
import Navbar from "../components/home/Navbar";
import { fetchPilotos } from "../services/pilotoService";
import Daniel from "../assets/Daniel_Ricciardo.png";
import { Link } from "react-router-dom";


export default function PilotosPage() {
  const [pilotos, setPilotos] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPilotos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchPilotos(page);
        setPilotos(data.pilotos);
        setPaginacion(data.paginacion)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPilotos();
  }, [page]);

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-1 items-center gap-5">
        <h1 className="text-4xl font-bold text-[#FFEB00] mb-5">
          Pilotos
        </h1>

        {loading && <p className="text-white">Cargando pilotos...</p>}

        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && pilotos.length === 0 && (
          <p className="text-gray-300">No hay pilotos disponibles.</p>
        )}

        {!loading && !error && pilotos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {pilotos.map((piloto) => (
                <Link
                  key={piloto.driver_number}
                  className="bg-neutral-900 rounded-xl p-5 shadow-lg border border-neutral-700 animate-fade-in transition-all duration-300 ease-out
                    hover:scale-[1.04] hover:-translate-y-2
                    hover:border-yellow-400
                    hover:shadow-2xl hover:shadow-yellow-400/20
                    group cursor-pointer"
                >
                  
                  <img
                    src={piloto.headshot_url || Daniel}
                    alt={piloto.full_name}
                    className="w-full h-35 object-contain mb-4 rounded-lg"
                    style={{ backgroundColor: `#${piloto.team_colour}` }}
                  />
                  

                  <h2 className="text-2xl font-bold text-white mb-2transition-colors duration-300 group-hover:text-yellow-400">
                    {piloto.full_name}
                  </h2>

                  {/* <p className="text-gray-300">
                    <strong>Número:</strong> {piloto.driver_number}
                  </p>
                  <p className="text-gray-300">
                    <strong>Acrónimo:</strong> {piloto.name_acronym}
                  </p>
                  <p className="text-gray-300">
                    <strong>Equipo:</strong> {piloto.team_name}
                  </p>
                  <p className="text-gray-300">
                    <strong>País:</strong> {piloto.country_code}
                  </p> */}
                </Link>
              ))}
            </div>

            {paginacion && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {paginacion.anterior && (  
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!paginacion.anterior}
                    className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50 transition-all duration-300 hover:bg-gray-600 hover:scale-105 cursor-pointer font-bold"
                  >
                    Anterior
                  </button>
                )}

                <span className="text-white">
                  Página {paginacion.page} de {paginacion.total_pages}
                </span>

                {paginacion.siguiente && (
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!paginacion.siguiente}
                    className="px-4 py-2 rounded bg-yellow-400 text-black disabled:opacity-50 transition-all duration-300 hover:bg-yellow-300 hover:scale-105 cursor-pointer font-bold"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
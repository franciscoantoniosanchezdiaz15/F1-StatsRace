import { useEffect, useState } from "react";
import Navbar from "../components/home/Navbar";
import { fetchPilotos } from "../services/pilotoService";
import Daniel from "../assets/Daniel_Ricciardo.png";


export default function PilotosPage() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPilotos() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchPilotos();
        setPilotos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPilotos();
  }, []);

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-1 grid grid-cols-1 md:grid-cols-1 items-center gap-12">
        <h1 className="text-4xl font-bold text-[#FFEB00] mb-10">
          Pilotos
        </h1>

        {loading && <p className="text-white">Cargando pilotos...</p>}

        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && pilotos.length === 0 && (
          <p className="text-gray-300">No hay pilotos disponibles.</p>
        )}

        {!loading && !error && pilotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {pilotos.map((piloto) => (
              <article
                key={piloto.driver_number}
                className="bg-neutral-900 rounded-xl p-5 shadow-lg border border-neutral-700"
              >
                
                <img
                  src={piloto.headshot_url || Daniel}
                  alt={piloto.full_name}
                  className="w-full h-35 object-contain mb-4 rounded-lg bg-black"
                />
                

                <h2 className="text-2xl font-bold text-white mb-2">
                  {piloto.full_name}
                </h2>

                <p className="text-gray-300">
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
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
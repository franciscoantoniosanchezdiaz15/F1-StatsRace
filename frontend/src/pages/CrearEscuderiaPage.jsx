import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchPilotosDisponiblesEscuderia, crearEscuderia} 
from "../services/escuderiaService";

export default function CrearEscuderiaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [pilotosDisponibles, setPilotosDisponibles] = useState([]);
  const [pilotosSeleccionados, setPilotosSeleccionados] = useState([]);
  const [presupuestoMax, setPresupuestoMax] = useState(100);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPilotos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchPilotosDisponiblesEscuderia();
        setPilotosDisponibles(data.pilotos);
        setPresupuestoMax(data.presupuesto_max);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarPilotos();
  }, []);

  function togglePiloto(driverNumber) {
    if (pilotosSeleccionados.includes(driverNumber)) {
      setPilotosSeleccionados(
        pilotosSeleccionados.filter((num) => num !== driverNumber)
      );
      return;
    }

    if (pilotosSeleccionados.length >= 2) {
      return;
    }

    setPilotosSeleccionados([...pilotosSeleccionados, driverNumber]);
  }

  const pilotosSeleccionadosData = pilotosDisponibles.filter((piloto) =>
    pilotosSeleccionados.includes(piloto.driver_number)
  );

  const costeActual = pilotosSeleccionadosData.reduce(
    (acc, piloto) => acc + piloto.precio,
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await crearEscuderia({
        nombre,
        pilotos: pilotosSeleccionados,
      });

      navigate("/escuderias");
    } catch (err) {
      setError(err.message);
       window.scrollTo({
        top: 0
        });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 py-10">
        <h1 className="text-4xl font-bold text-[#FFEB00] mb-8">
          Crear Escudería
        </h1>

        {loading && <p className="text-white">Cargando pilotos...</p>}
        {error && <p className="text-red-400 mb-4">Error: {error}</p>}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                Nombre de la escudería
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full max-w-md px-4 py-2 rounded bg-neutral-800 text-white border border-neutral-600"
                placeholder="Introduce un nombre"
              />
            </div>

            <div className="mb-6">
              <p className="text-white text-lg">
                <strong>Presupuesto máximo:</strong> {presupuestoMax}
              </p>
              <p className="text-white text-lg">
                <strong>Coste actual:</strong> {costeActual}
              </p>
              <p className="text-white text-lg">
                <strong>Pilotos seleccionados:</strong> {pilotosSeleccionados.length}/2
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pilotosDisponibles.map((piloto) => {
                const seleccionado = pilotosSeleccionados.includes(piloto.driver_number);

                return (
                  <article
                    key={piloto.driver_number}
                    onClick={() => togglePiloto(piloto.driver_number)}
                    className={`rounded-xl p-5 border cursor-pointer transition ${
                      seleccionado
                        ? "bg-yellow-400 text-black border-yellow-300"
                        : "bg-neutral-900 text-white border-neutral-700 hover:border-yellow-400"
                    }`}
                  >
                    <h2 className="text-xl font-bold mb-2">{piloto.full_name}</h2>
                    <p><strong>Equipo:</strong> {piloto.team_name}</p>
                    <p><strong>Precio:</strong> {piloto.precio}</p>
                  </article>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear escudería"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
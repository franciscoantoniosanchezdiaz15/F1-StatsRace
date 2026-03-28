import { useEffect, useState } from "react";
import { fetchDatosDueloEscuderias } from "../../services/dueloEscuderiasService";
import { useNavigate } from "react-router-dom";

export default function DueloEscuderiasForm({ modo, onSubmit }) {
  const navigate = useNavigate();

  const [escuderias, setEscuderias] = useState([]);
  const [circuitos, setCircuitos] = useState([]);

  const [escuderiaUsuarioId, setEscuderiaUsuarioId] = useState("");
  const [modoRival, setModoRival] = useState("manual");
  const [escuderiaRivalId, setEscuderiaRivalId] = useState("");

  const [modoCircuito, setModoCircuito] = useState("manual");
  const [circuitoKey, setCircuitoKey] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchDatosDueloEscuderias();
        setEscuderias(data.escuderias);
        setCircuitos(data.circuitos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (!escuderiaUsuarioId) {
        throw new Error("Debes seleccionar tu escudería");
      }

      if (modoRival === "manual" && !escuderiaRivalId) {
        throw new Error("Debes seleccionar una escudería rival");
      }

      if (modoCircuito === "manual" && !circuitoKey) {
        throw new Error("Debes seleccionar un circuito");
      }

      const payload = {
        modo,
        modo_rival: modoRival,
        modo_circuito: modoCircuito,
        escuderia_id_1: Number(escuderiaUsuarioId),
      };

      if (modoRival === "manual") {
        payload.escuderia_id_2 = Number(escuderiaRivalId);
      }

      if (modoCircuito === "manual") {
        payload.circuito_key = Number(circuitoKey);
      }

      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
      window.scrollTo({
        top: 0
      });
    } finally {
      setSubmitting(false);
    }
  }

  const rivalesDisponibles = escuderias.filter(
    (escuderia) => escuderia.id !== Number(escuderiaUsuarioId)
  );

  return (
    <section className="max-w-5xl mx-auto px-10 py-10">
      <h1 className="text-4xl font-bold text-[#FFEB00] mb-8">
        Duelo de Escuderías - {modo === "carrera" ? "Carrera completa" : "Mejor tiempo"}
      </h1>

      {loading && <p className="text-white">Cargando datos...</p>}
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}

      {!loading && escuderias.length === 0 && (
        <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700">
          <p className="text-white text-lg mb-4">
            No tienes ninguna escudería creada.
          </p>
          <p className="text-gray-400 mb-6">
            Para simular un duelo primero debes crear tu escudería.
          </p>

          <button
            onClick={() => navigate("/escuderias/crear")}
            className="px-6 py-3 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
          >
            Crear escudería
          </button>
        </div>
      )}

      {!loading && escuderias.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 space-y-6"
        >
          <div>
            <label className="block text-white font-bold mb-2">
              Tu escudería
            </label>
            <select
              value={escuderiaUsuarioId}
              onChange={(e) => setEscuderiaUsuarioId(e.target.value)}
              className="w-full px-4 py-3 rounded bg-neutral-800 text-white border border-neutral-600"
            >
              <option value="">Selecciona una escudería</option>
              {escuderias.map((escuderia) => (
                <option key={escuderia.id} value={escuderia.id}>
                  {escuderia.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-bold mb-2">
              Tipo de rival
            </label>
            <select
              value={modoRival}
              onChange={(e) => setModoRival(e.target.value)}
              className="w-full px-4 py-3 rounded bg-neutral-800 text-white border border-neutral-600"
            >
              <option value="manual">Manual</option>
              <option value="aleatorio">Aleatorio</option>
            </select>
          </div>

          {modoRival === "manual" && (
            <div>
              <label className="block text-white font-bold mb-2">
                Escudería rival
              </label>
              <select
                value={escuderiaRivalId}
                onChange={(e) => setEscuderiaRivalId(e.target.value)}
                className="w-full px-4 py-3 rounded bg-neutral-800 text-white border border-neutral-600"
              >
                <option value="">Selecciona una escudería rival</option>
                {rivalesDisponibles.map((escuderia) => (
                  <option key={escuderia.id} value={escuderia.id}>
                    {escuderia.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-white font-bold mb-2">
              Tipo de circuito
            </label>
            <select
              value={modoCircuito}
              onChange={(e) => setModoCircuito(e.target.value)}
              className="w-full px-4 py-3 rounded bg-neutral-800 text-white border border-neutral-600"
            >
              <option value="manual">Elegir circuito</option>
              <option value="aleatorio">Aleatorio</option>
            </select>
          </div>

          {modoCircuito === "manual" && (
            <div>
              <label className="block text-white font-bold mb-2">
                Circuito
              </label>
              <select
                value={circuitoKey}
                onChange={(e) => setCircuitoKey(e.target.value)}
                className="w-full px-4 py-3 rounded bg-neutral-800 text-white border border-neutral-600"
              >
                <option value="">Selecciona un circuito</option>
                {circuitos.map((circuito) => (
                  <option key={circuito.circuit_key} value={circuito.circuit_key}>
                    {circuito.circuit_short_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition disabled:opacity-50"
          >
            {submitting ? "Simulando..." : "Simular duelo"}
          </button>
        </form>
      )}
    </section>
  );
}
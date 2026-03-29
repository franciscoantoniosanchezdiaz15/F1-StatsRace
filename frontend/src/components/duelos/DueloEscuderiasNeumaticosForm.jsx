import { useMemo, useState } from "react";

const COMPUESTOS = ["SOFT", "MEDIUM", "HARD"];

export default function DueloEscuderiasNeumaticosForm({
  configDuelo,
  escuderiaUsuario,
  onSubmit,
}) {
  const [compuestosUsuario, setCompuestosUsuario] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pilotos = useMemo(() => escuderiaUsuario?.pilotos || [], [escuderiaUsuario]);

  function handleChange(driverNumber, compuesto) {
    setCompuestosUsuario((prev) => ({
      ...prev,
      [driverNumber]: compuesto,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setSubmitting(true);

      for (const piloto of pilotos) {
        if (!compuestosUsuario[piloto.driver_number]) {
          throw new Error(`Debes elegir neumático para ${piloto.full_name}`);
        }
      }

      const payloadFinal = {
        ...configDuelo,
        compuestos_usuario: compuestosUsuario,
      };

      await onSubmit(payloadFinal);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!escuderiaUsuario) {
    return (
      <section className="max-w-5xl mx-auto px-10 py-10">
        <p className="text-red-400">No se encontró la escudería seleccionada.</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-10 py-10">
      <h1 className="text-4xl font-bold text-[#FFEB00] mb-8">
        Selección de neumáticos
      </h1>

      <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {escuderiaUsuario.nombre}
        </h2>

        <p className="text-gray-300">
          Elige un compuesto para cada piloto de tu escudería.
        </p>
      </div>

      {error && <p className="text-red-400 mb-4">Error: {error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 space-y-6"
      >
        {pilotos.map((piloto) => (
          <div
            key={piloto.driver_number}
            className="bg-neutral-800 rounded-xl p-5 border border-neutral-700"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              {piloto.full_name}
            </h3>

            <p className="text-gray-300 mb-4">
              {piloto.team_name} · Precio: {piloto.precio}
            </p>

            <label className="block text-white font-bold mb-2">
              Compuesto
            </label>

            <select
              value={compuestosUsuario[piloto.driver_number] || ""}
              onChange={(e) => handleChange(piloto.driver_number, e.target.value)}
              className="w-full px-4 py-3 rounded bg-neutral-900 text-white border border-neutral-600"
            >
              <option value="">Selecciona un compuesto</option>
              {COMPUESTOS.map((compuesto) => (
                <option key={compuesto} value={compuesto}>
                  {compuesto}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition disabled:opacity-50"
        >
          {submitting ? "Compitiendo..." : "Competir"}
        </button>
      </form>
    </section>
  );
}
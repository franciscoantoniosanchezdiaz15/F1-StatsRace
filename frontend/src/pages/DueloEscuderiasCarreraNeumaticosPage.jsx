import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import DueloEscuderiasNeumaticosForm from "../components/duelos/DueloEscuderiasNeumaticosForm";
import { simularDueloEscuderiasCarrera } from "../services/dueloEscuderiasService";

export default function DueloEscuderiasCarreraNeumaticosPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const configDuelo = location.state?.configDuelo;
  const escuderiaUsuario = location.state?.escuderiaUsuario;

  async function handleSubmit(payloadFinal) {
    const resultado = await simularDueloEscuderiasCarrera(payloadFinal);

    navigate("/duelos/escuderias/resultado", {
      state: { resultado },
    });
  }

  if (!configDuelo || !escuderiaUsuario) {
    return (
      <div>
        <Navbar />
        <section className="max-w-5xl mx-auto px-10 py-10">
          <p className="text-red-400 mb-4">
            No hay configuración del duelo disponible.
          </p>
          <button
            onClick={() => navigate("/duelos/escuderias/carrera")}
            className="px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
          >
            Volver
          </button>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 pt-8">
        <button
          onClick={() => navigate("/duelos/escuderias/carrera", { state: location.state })}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>
      </section>

      <DueloEscuderiasNeumaticosForm
        configDuelo={configDuelo}
        escuderiaUsuario={escuderiaUsuario}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
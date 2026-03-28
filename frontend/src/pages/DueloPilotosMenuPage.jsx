import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

export default function DueloPilotosMenuPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <section className="max-w-6xl mx-auto px-10 py-10">
        <button
          onClick={() => navigate("/duelos")}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>

        <h1 className="text-4xl font-bold text-[#FFEB00] mb-10">
          Duelo de Pilotos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <article
            onClick={() => navigate("/duelos/pilotos/carrera")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Carrera completa
            </h2>

            <p className="text-gray-300 text-lg">
              Simula una carrera completa entre dos pilotos.
            </p>
          </article>

          <article
            onClick={() => navigate("/duelos/pilotos/mejor-tiempo")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Mejor tiempo
            </h2>

            <p className="text-gray-300 text-lg">
              Simula quién consigue la mejor vuelta rápida.
            </p>
          </article>
        </div>

        <button
            onClick={() => navigate("/duelos/pilotos/historial")}
            className="mt-8 px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
          >
            Ver historial
        </button>

      </section>
    </div>
  );
}
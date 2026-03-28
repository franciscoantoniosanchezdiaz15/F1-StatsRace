import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

export default function DueloEscuderiasMenuPage() {
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
          Duelo de Escuderías Personalizadas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <article
            onClick={() => navigate("/duelos/escuderias/carrera")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Carrera completa
            </h2>

            <p className="text-gray-300 text-lg">
              Enfrenta dos escuderías en una simulación de carrera completa.
            </p>
          </article>

          <article
            onClick={() => navigate("/duelos/escuderias/mejor-tiempo")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Mejor tiempo
            </h2>

            <p className="text-gray-300 text-lg">
              Enfrenta dos escuderías para ver quién marca la mejor vuelta.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

export default function DuelosPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <section className="max-w-6xl mx-auto px-10 py-10">
        <h1 className="text-4xl font-bold text-[#FFEB00] mb-10">
          Modo Duelo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <article
            onClick={() => navigate("/duelos/pilotos")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Batalla con pilotos
            </h2>

            <p className="text-gray-300 text-lg">
              Enfrenta dos pilotos en una simulación de carrera completa o de mejor tiempo.
            </p>
          </article>

          <article
            onClick={() => navigate("/duelos/escuderias")}
            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-700 cursor-pointer hover:scale-105 hover:border-yellow-400 transition"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Batalla de escuderías personalizadas
            </h2>

            <p className="text-gray-300 text-lg">
              Usa escuderías creadas por usuarios y enfréntalas en carrera completa o mejor tiempo.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
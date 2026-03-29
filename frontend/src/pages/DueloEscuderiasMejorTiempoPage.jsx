import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import DueloEscuderiasForm from "../components/duelos/DueloEscuderiasForm";

export default function DueloEscuderiasMejorTiempoPage() {
  const navigate = useNavigate();

  async function handleContinue(payload, escuderias) {
     const escuderiaUsuario = escuderias.find( (escuderia) => escuderia.id === payload.escuderia_id_1);

    navigate("/duelos/escuderias/mejor-tiempo/neumaticos", { 
      state: {
        configDuelo: payload,
        escuderiaUsuario
      }})
  }

  return (
    <div>
      <Navbar />

      <section className="max-w-5xl mx-auto px-10 pt-8">
        <button
          onClick={() => navigate("/duelos/escuderias")}
          className="mb-6 px-5 py-2 bg-[#FFEB00] text-black font-bold rounded hover:brightness-95 transition"
        >
          ← Volver
        </button>
      </section>

      <DueloEscuderiasForm modo="mejor-tiempo" onContinue={handleContinue} />
    </div>
  );
}
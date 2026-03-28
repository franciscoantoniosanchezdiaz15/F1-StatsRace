import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import DueloEscuderiasForm from "../components/duelos/DueloEscuderiasForm";

export default function DueloEscuderiasCarreraPage() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    console.log("Payload carrera escuderías:", payload);
   
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

      <DueloEscuderiasForm modo="carrera" onSubmit={handleSubmit} />
    </div>
  );
}
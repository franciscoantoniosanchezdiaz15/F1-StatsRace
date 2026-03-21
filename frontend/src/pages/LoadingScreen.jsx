import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners"
import bg from "../assets/f1-bg.png"

function LoadingScreen() {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="p-10 rounded-xl w-full max-w-xl flex flex-col items-center w-full text-center">
        <h2 className="text-3xl font-bold text-[#FFEB00] mb-4">
          Cargando sistema...
        </h2>

        <p className="text-gray-300 mb-6">
          Preparando estadísticas, pilotos y simulaciones de carrera.
        </p>

        <BarLoader
          color="#A6051A"
          loading={true}
          width={300}
          height={8}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

        <p className="mt-4 text-sm text-gray-400">
          Inicializando F1 StatsRace...
        </p>

        <div className="flex justify-center">
            <img
              src={bg}
              alt="F1 StatsRace"
              className="w-full max-w-xl object-contain"
            />
          </div>
      </div>
    </div>
  )
}

export default LoadingScreen
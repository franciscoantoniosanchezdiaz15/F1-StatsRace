import { BarLoader } from "react-spinners"
import bg from "../assets/f1-bg.png"

function LoadingScreen() {
  return (
    <div className="mt-20 bg-black/70 backdrop-blur-sm p-10 rounded-xl w-full max-w-xl flex flex-col items-center">
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
  )
}

export default LoadingScreen
import bg from "../assets/f1-bg.png"

function StartScreen({ onEmpezar }) {
  return (
    <div className="mt-20 bg-black/60 backdrop-blur-sm p-10 rounded-xl">
          <h1 className="text-5xl font-bold mb-4 text-[#FFEB00]">
            F1 StatsRace
          </h1>

          <p className="text-gray-300 max-w-xl mb-8">
            Simulador de duelos de Fórmula 1 basado en datos reales.
          </p>

          <button
            onClick={onEmpezar}
            className="bg-[#A6051A] hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition"
          >
            Empezar
          </button>

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

export default StartScreen
import bg from "../../assets/f1-bg.png"

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
      <div className="text-left">
        <h2 className="text-5xl md:text-6xl font-black leading-tight">
          Analiza pilotos y simula duelos de Fórmula 1
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          Consulta estadísticas reales, compara rendimientos históricos y descubre
          quién dominaría la carrera en un duelo basado en datos de OpenF1.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="bg-[#A6051A] text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition">
            Comenzar ahora
          </button>

          <button className="bg-[#FFEB00] text-black px-6 py-3 rounded-md font-bold hover:brightness-95 transition">
            Ver pilotos
          </button>
        </div>
      </div>

      <div>
        <img
          src={bg}
          alt="F1 StatsRace"
        />
      </div>
    </section>
  )
}

export default Hero
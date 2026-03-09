function Navbar() {
  return (
    <header className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#A6051A]">
        F1 StatsRace
      </h1>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button className="hover:text-[#A6051A] transition">Inicio</button>
        <button className="hover:text-[#A6051A] transition">Pilotos</button>
        <button className="hover:text-[#A6051A] transition">Circuitos</button>
        <button className="hover:text-[#A6051A] transition">Equipos</button>
        <button className="hover:text-[#A6051A] transition">Duelo</button>
      </nav>

      <div className="flex items-center gap-3">
        <button className="bg-[#A6051A] text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-600 transition">
            Registro
        </button>
        <button className="border border-[#A6051A] text-[#A6051A] px-4 py-2 rounded-md font-semibold hover:bg-red-50 transition">
          Iniciar sesión
        </button>
      </div>
      
    </header>
  )
}

export default Navbar
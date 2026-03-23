import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { fetchPilotoDetalle } from "../services/pilotoService";
import Daniel from "../assets/Daniel_Ricciardo.png";
import { getBandera } from "../utils/getBandera";

export default function PilotoDetalle() {
  const { driver_number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state;
  const page = state && state.page ? state.page : 1;

  const [piloto, setPiloto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchPilotoDetalle(driver_number);
        setPiloto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalle();
  }, [driver_number]);

  return (
    <div>
      <Navbar />
      
      <section className="max-w-5xl mx-auto px-10 pt-10">
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#A6051A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-400 animate-pulse font-mono">Cargando piloto...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-400 font-bold uppercase">Error: {error}</p>
          </div>
        )}

        {!loading && !error && piloto && (
          <article className="relative overflow-hidden bg-neutral-900 rounded-tr-[50px] rounded-bl-[50px] border-l-4 border-t-4 border-neutral-700 shadow-2xl flex flex-col md:flex-row items-stretch">
            
            <div 
              className="relative w-full md:w-1/2 flex items-center justify-center p-6"
              style={{ 
                background: `linear-gradient(135deg, #${piloto.team_colour}44 0%, #171717 100%)`,
                borderBottom: `8px solid #${piloto.team_colour}`
              }}
            >
              <div className="absolute top-4 left-4 bg-black px-3 py-1 rounded-sm border border-white/20">
                <span className="text-xl font-black bg-black">{piloto.country_code}</span>
                <img src={getBandera(piloto.country_code)} alt={piloto.country_code} />
              </div>

              <img
                src={piloto.headshot_url || Daniel}
                alt={piloto.full_name}
                className="w-full h-[300px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
              />
              
              <span className="absolute bottom-0 right-4 text-9xl font-black opacity-10 italic">
                {piloto.driver_number}
              </span>
            </div>

            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <header className="mb-8">
                <p className="text-[#FFEB00] font-mono tracking-widest uppercase text-sm mb-1">Formula 1 Official Driver</p>
                <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                  {piloto.full_name}
                </h1>
                <div className="h-2 w-24 mt-4" style={{ backgroundColor: `#${piloto.team_colour}` }}></div>
              </header>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Apodo / Acrónimo</p>
                  <p className="text-3xl font-bold">{piloto.name_acronym}</p>
                </div>

                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Equipo</p>
                  <p className="text-3xl font-bold text-neutral-200 uppercase italic">
                    {piloto.team_name}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">País</p>
                    <p className="text-xl">{piloto.country_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Dorsal</p>
                    <p className="text-5xl font-black italic" style={{ color: `#${piloto.team_colour}` }}>
                      {piloto.driver_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[-20px] right-[-20px] opacity-5">
               <svg width="200" height="200" viewBox="0 0 100 100" fill="white">
                  <path d="M10,50 Q40,10 90,50 T10,90" fill="none" stroke="white" strokeWidth="2" />
               </svg>
            </div>
          </article>
        )}        
      </section>

      <button
        onClick={() => navigate(`/pilotos?page=${page}`)}
        className="mt-10 group flex items-center gap-3 px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 transition-all hover:border-white hover:text-white cursor-pointer font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-white/5">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Anterior
      </button>

    </div>
  );
}
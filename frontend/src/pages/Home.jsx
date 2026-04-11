import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mostrarError, setMostrarError] = useState(!!state?.errorAuth);

  useEffect(() => {
    if (state?.errorAuth) {
      const timer = setTimeout(() => setMostrarError(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      <Navbar />

      <div
        className={`fixed top-25 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          mostrarError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-neutral-950 border border-red-500/50 rounded-2xl px-6 py-4 shadow-[0_0_20px_rgba(166,5,26,0.3)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
          <p className="text-sm font-black uppercase tracking-widest text-red-400">
            {state?.errorAuth}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="ml-4 px-4 py-1 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-red-500 transition-colors"
          >
            Login
          </button>
        </div>
      </div>

      <Hero />
    </div>
  );
}

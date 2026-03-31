import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(usuario, contraseña);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      <div 
        onClick={() => navigate("/home")} 
        className="flex items-center gap-3 cursor-pointer group mb-10 relative z-10"
      >
        <div className="h-10 w-1.5 bg-[#A6051A] group-hover:h-12 group-hover:bg-white transition-all duration-300"></div>
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          F1 <span className="text-[#A6051A] group-hover:text-white transition-colors">Stats</span>Race
        </h1>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-[#A6051A] to-[#6b0311] px-10 py-6">
            <h2 className="text-xl font-black italic uppercase tracking-widest text-white leading-none">
              Driver Login
            </h2>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Authentication Required
            </p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-[#A6051A] focus:ring-1 focus:ring-[#A6051A] transition-all font-bold italic uppercase tracking-tight"
                  placeholder="Tu usuario"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2 ml-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-[#A6051A] focus:ring-1 focus:ring-[#A6051A] transition-all font-bold tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-900/10 border-l-2 border-red-600 px-4 py-2 rounded-md">
                  <p className="text-red-500 text-[11px] font-black uppercase tracking-tighter italic">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-2xl bg-white px-8 py-5 transition-all hover:bg-[#A6051A]"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-black font-black uppercase italic tracking-widest group-hover:text-white transition-colors">
                    Iniciar Sistema
                  </span>
                </div>
              </button>
            </form>

          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-4 opacity-30">
          <span className="text-[8px] font-black uppercase tracking-widest">Session.v2026.03</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Data Link</span>
        </div>
      </div>
    </div>
  );
}
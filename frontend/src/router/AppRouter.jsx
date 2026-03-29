import { Routes, Route, Navigate } from "react-router-dom";
import StartScreen from "../pages/StartScreen";
import LoadingScreen from "../pages/LoadingScreen";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PilotosPage from "../pages/PilotosPage";
import PilotoDetalle from "../pages/PilotoDetalle";
import CircuitosPage from "../pages/CircuitosPage";
import CircuitoDetalle from "../pages/CircuitoDetalle";
import EquiposPage from "../pages/EquiposPage";
import EquipoDetalle from "../pages/EquipoDetalle"
import DuelosPage from "../pages/DuelosPage";
import EscuderiasPage from "../pages/EscuderiasPage";
import CrearEscuderiaPage from "../pages/CrearEscuderiaPage";
import EscuderiaDetallePage from "../pages/EscuderiaDetallePage";
import DueloPilotosMenuPage from "../pages/DueloPilotosMenuPage";
import DueloEscuderiasMenuPage from "../pages/DueloEscuderiasMenuPage";
import DueloEscuderiasCarreraPage from "../pages/DueloEscuderiasCarreraPage";
import DueloEscuderiasMejorTiempoPage from "../pages/DueloEscuderiasMejorTiempoPage";
import DueloEscuderiasResultadoPage from "../pages/DueloEscuderiasResultadoPage";
import DueloEscuderiasHistorialPage from "../pages/DueloEscuderiasHistorialPage";
import DueloEscuderiasCarreraNeumaticosPage from "../pages/DueloEscuderiasCarreraNeumaticosPage";
import DueloEscuderiasMejorTiempoNeumaticosPage from "../pages/DueloEscuderiasMejorTiempoNeumaticosPage";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/pilotos" element={<PilotosPage />} />
      <Route path="/pilotos/:driver_number" element={<PilotoDetalle />} />
      <Route path="/circuitos" element={<CircuitosPage />} />
      <Route path="/circuitos/:circuito_key" element={<CircuitoDetalle />} />
      <Route path="/equipos" element={<EquiposPage />} />
      <Route path="/equipos/:team_name" element={<EquipoDetalle />} />
      <Route path="/duelos" element={<DuelosPage />} />
      <Route path="/escuderias" element={<EscuderiasPage />} />
      <Route path="/escuderias/crear" element={<CrearEscuderiaPage />} />
      <Route path="/escuderias/:escuderia_id" element={<EscuderiaDetallePage />} />
      <Route path="/duelos/pilotos" element={<DueloPilotosMenuPage />} />
      <Route path="/duelos/escuderias" element={<DueloEscuderiasMenuPage />} />
      <Route path="/duelos/escuderias/carrera" element={<DueloEscuderiasCarreraPage />} />
      <Route path="/duelos/escuderias/mejor-tiempo" element={<DueloEscuderiasMejorTiempoPage />} />
      <Route path="/duelos/escuderias/resultado" element={<DueloEscuderiasResultadoPage />} />
      <Route path="/duelos/escuderias/historial" element={<DueloEscuderiasHistorialPage />} />
      <Route path="/duelos/escuderias/carrera/neumaticos" element={<DueloEscuderiasCarreraNeumaticosPage />} />
      <Route path="/duelos/escuderias/mejor-tiempo/neumaticos" element={<DueloEscuderiasMejorTiempoNeumaticosPage />} />
    </Routes>
  );
}
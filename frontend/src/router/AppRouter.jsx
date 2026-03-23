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
    </Routes>
  );
}
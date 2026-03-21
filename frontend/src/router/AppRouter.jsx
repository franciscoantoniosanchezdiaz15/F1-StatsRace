import { Routes, Route, Navigate } from "react-router-dom";
import StartScreen from "../pages/StartScreen";
import LoadingScreen from "../pages/LoadingScreen";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PilotosPage from "../pages/PilotosPage";

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
    </Routes>
  );
}
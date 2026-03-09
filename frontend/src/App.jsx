import { useState } from "react"

import Home from "./pages/Home"
import StartScreen from "./pages/StartScreen"
import LoadingScreen from "./pages/LoadingScreen"

function App() {
  const [pantalla, setPantalla] = useState("inicio")

  const handleEmpezar = () => {
    setPantalla("carga")

    setTimeout(() => {
      setPantalla("menu")
    }, 2500)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start text-white text-center p-6 bg-no-repeat bg-center bg-black"
    >
      {pantalla === "inicio" && (
        <StartScreen onEmpezar={handleEmpezar}/>
      )}

      {pantalla === "carga" && (
        <LoadingScreen/>
      )}

      {pantalla === "menu" && (
        <Home/>
      )}
    </main>
  )
}

export default App
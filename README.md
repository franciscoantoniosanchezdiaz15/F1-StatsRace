# F1-StatsRace
F1 StatsRace es una aplicación web full-stack. Hecha con Flask, React+JS y TailwindCSS. Basada en datos reales de Fórmula 1 (OpenF1 API) de la temporada 2023 que permite a los usuarios crear escuderías personalizadas y simular duelos estratégicos entre ellas.

El proyecto combina análisis de datos reales con mecánicas de juego, incluyendo selección de pilotos, gestión de presupuesto y simulación de rendimiento en carrera.

## Funcionalidades

- 🔐 Registro y autenticación de usuarios
- 🏎️ Consulta de pilotos, equipos y circuitos (OpenF1 API)
- 🏁 Creación de escuderías personalizadas
- 💰 Sistema de presupuesto para seleccionar pilotos en escuderías personalizadas
- ⚔️ Simulación de duelos entre escuderías personalizadas y pilotos
- 🧠 Bonus estratégicos para escuderías personalizadas (neumáticos y química) y para pilotos (neumáticos)
- 📊 Historial de duelos

## Arquitectura

El proyecto sigue una arquitectura full-stack separada:

- **Frontend:** React + Vite
- **Backend:** Flask (Python)
- **Base de datos:** MySQL
- **API externa:** OpenF1

### Backend
- routes → endpoints
- services → lógica de negocio
- repositories → acceso a datos
- models → ORM (SQLAlchemy)

### Frontend
- pages → vistas principales
- components → UI reutilizable
- services → llamadas a API
- context → gestión de estado (auth)

## Tecnologías

### Backend
- Python
- Flask
- SQLAlchemy
- MySQL

### Frontend
- React
- Vite
- JavaScript

### DevOps
- Docker
- Docker Compose

## Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/franciscoantoniosanchezdiaz15/F1-StatsRace.git
cd f1-statsrace
```
### 2. Ir al directorio Backend, crear entorno virtual y instalar dependencias
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\pip.exe install -r requirements.txt
```

### 3. Crear archivo .env
```bash
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=f1statsrace_db

SECRET_KEY=dev_secret_key
FRONTEND_URL=http://localhost:5173

SESSION_COOKIE_SECURE=False
SESSION_COOKIE_SAMESITE=Lax
```

### 4. Ejecutar servidor
```bash
.\.venv\Scripts\python.exe -m app.main
```

### 5. Servidor disponible
```bash
http://localhost:5000
```

### 6. Ir al directorio Frontend
```bash
cd frontend
npm install
```

### 7. Crear archivo .env
```bash
VITE_API_URL=http://localhost:5000
```

### 8. Ejecutar fronted
```bash
npm run dev
```

## Limitaciones
- Datos limitados a temporada 2023 de F1
- Dependencia de API OpenF1

## Mejoras futuras

- Soporte multi-temporada
- Sistema de ligas entre usuarios
- Ranking global

## Autor

Francisco Antonio  

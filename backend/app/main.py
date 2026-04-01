from app.routes.duelo_piloto_routes import duelo_piloto_bp
from app.routes.duelo_escuderia_routes import duelo_escuderia_bp
from app.routes.escuderia_routes import escuderia_bp
from app.routes.equipo_routes import equipo_bp
from app.routes.circuito_routes import circuito_bp
from app.routes.piloto_routes import piloto_bp
from app.routes.auth_routes import auth_bp
from app.models.participar import Participar
from app.models.duelo_escuderia import DueloEscuderia
from app.models.duelo import Duelo
from app.models.escuderia import Escuderia
from app.models.usuario import Usuario
from app.config import Config
from app.database.db import db
from flask_cors import CORS
from flask import Flask
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

CORS(
    app,
    supports_credentials=True,
    origins=[frontend_url]
)

app.register_blueprint(auth_bp)
app.register_blueprint(piloto_bp)
app.register_blueprint(circuito_bp)
app.register_blueprint(equipo_bp)
app.register_blueprint(escuderia_bp)
app.register_blueprint(duelo_escuderia_bp)
app.register_blueprint(duelo_piloto_bp)


@app.route("/")
def inicio():
    return "Bienvenido a F1 StatsRace"


@app.route("/health/db")
def health_db():
    try:
        db.session.execute(db.text("SELECT 1"))
        return {"message": "DB conectada"}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)

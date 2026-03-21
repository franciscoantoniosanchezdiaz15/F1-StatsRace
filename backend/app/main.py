from flask import Flask
from app.database.db import db
from app.config import Config
from flask_cors import CORS

from app.models.usuario import Usuario
from app.models.escuderia import Escuderia
from app.models.duelo import Duelo
from app.models.duelo_escuderia import DueloEscuderia
from app.models.participar import Participar

from app.routes.auth_routes import auth_bp
from app.routes.piloto_routes import piloto_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)

app.register_blueprint(auth_bp)
app.register_blueprint(piloto_bp)


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

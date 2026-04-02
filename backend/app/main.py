from app.routes.duelo_piloto_routes import duelo_piloto_bp
from app.routes.duelo_escuderia_routes import duelo_escuderia_bp
from app.routes.escuderia_routes import escuderia_bp
from app.routes.equipo_routes import equipo_bp
from app.routes.circuito_routes import circuito_bp
from app.routes.piloto_routes import piloto_bp
from app.routes.auth_routes import auth_bp
from app.models.piloto_escuderia import PilotoEscuderia
from app.models.participar import Participar
from app.models.duelo_escuderia import DueloEscuderia
from app.models.duelo import Duelo
from app.models.escuderia import Escuderia
from app.models.usuario import Usuario
from app.database.db import db
from app.config import Config
from flask_migrate import Migrate
from flask_cors import CORS
from flask import Flask
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

migrate = Migrate(app, db)


@app.cli.command("seed")
def seed():
    print("Insertando datos")

    # para evitar datos duplicados
    if Usuario.query.filter_by(nombre="admin").first():
        print("El seed ya fue ejecutado.")
        return

    admin = Usuario(
        nombre="admin",
        contraseña="1234"
    )

    db.session.add(admin)
    db.session.commit()

    escuderia1 = Escuderia(
        nombre="TenGris",
        presupuesto_max=100,
        coste_total=100,
        usuario_id=admin.id
    )

    piloto1 = PilotoEscuderia(
        driver_number=1,
        full_name="Max Verstappen",
        team_name="Red Bull Racing",
        precio=80,
        escuderia=escuderia1
    )

    piloto2 = PilotoEscuderia(
        driver_number=2,
        full_name="Logan Sargeant",
        team_name="Williams",
        precio=20,
        escuderia=escuderia1
    )

    escuderia2 = Escuderia(
        nombre="AintanPlex",
        presupuesto_max=100,
        coste_total=95,
        usuario_id=admin.id
    )

    piloto3 = PilotoEscuderia(
        driver_number=16,
        full_name="Charles Leclerc",
        team_name="Ferrari",
        precio=55,
        escuderia=escuderia2
    )

    piloto4 = PilotoEscuderia(
        driver_number=4,
        full_name="Lando Norris",
        team_name="McLaren",
        precio=40,
        escuderia=escuderia2
    )

    escuderia3 = Escuderia(
        nombre="Inmortal",
        presupuesto_max=100,
        coste_total=95,
        usuario_id=admin.id
    )

    piloto5 = PilotoEscuderia(
        driver_number=14,
        full_name="Fernando Alonso",
        team_name="Aston Martin",
        precio=40,
        escuderia=escuderia3
    )

    piloto6 = PilotoEscuderia(
        driver_number=63,
        full_name="George Russell",
        team_name="Mercedes",
        precio=55,
        escuderia=escuderia3
    )

    db.session.add_all([
        escuderia1,
        escuderia2,
        escuderia3,
        piloto1,
        piloto2,
        piloto3,
        piloto4,
        piloto5,
        piloto6
    ])

    db.session.commit()

    print("Seed completado correctamente")


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

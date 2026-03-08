from flask import Flask

app = Flask(__name__)


@app.route("/")
def inicio():
    return "Bienvenido a F1 StatsRace"


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)

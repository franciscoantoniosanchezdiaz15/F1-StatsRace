#!/bin/sh

export FLASK_APP=app.main:app

echo "Aplicando migraciones..."
flask db upgrade

echo "Insertando datos iniciales..."
flask --app app.main:app seed

echo "Iniciando servidor..."
gunicorn -w 4 -b 0.0.0.0:5000 app.main:app
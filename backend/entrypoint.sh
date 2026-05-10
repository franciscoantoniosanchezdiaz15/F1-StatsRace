#!/bin/sh

export FLASK_APP=app.main:app

echo "Aplicando migraciones..."
flask db upgrade

echo "Iniciando servidor..."
gunicorn -w 4 -b 0.0.0.0:5000 app.main:app
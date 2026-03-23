from collections import OrderedDict
import time
import requests
from concurrent.futures import ThreadPoolExecutor

TIEMPO_LIMITE = 300  # 5 min máximo para el cache
MAX_CACHE_PILOTOS = 5

BASE_URL = "https://api.openf1.org/v1"


class OpenF1Client:
    def __init__(self):
        self._cachePilotos = OrderedDict()

    def fetch_carreras(self, year):
        url = f"{BASE_URL}/sessions?year={year}&session_type=Race&session_name=Race"

        try:
            response = requests.get(url)
            data = response.json()
            return data
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_pilotos(self, session_key):
        if session_key in self._cachePilotos:
            data = self._cachePilotos[session_key]

            if time.time() - data["expiracion"] < TIEMPO_LIMITE:
                return data["payload"]

        url = f"{BASE_URL}/drivers?session_key={session_key}"

        try:
            response = requests.get(url)
            data = response.json()

            self._cachePilotos[session_key] = {
                "payload": data,
                "expiracion": time.time()
            }

            # Borramos el primero si pasamos del límite de tamaño
            if len(self._cachePilotos) > MAX_CACHE_PILOTOS:
                self._cachePilotos.popitem(last=False)

            return data
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_session_resultados(self, session_key):
        url = f"{BASE_URL}/session_result?session_key={session_key}&position<=3"

        try:
            response = requests.get(url)
            data = response.json()
            return data
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

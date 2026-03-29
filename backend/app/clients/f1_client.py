from collections import OrderedDict
import time
import requests
from concurrent.futures import ThreadPoolExecutor

TIEMPO_LIMITE = 300  # 5 min máximo para el cache
MAX_CACHE_PILOTOS = 5
MAX_CACHE_SESSION_RESULTS = 5

BASE_URL = "https://api.openf1.org/v1"


class OpenF1Client:
    def __init__(self):
        self._cachePilotos = OrderedDict()
        self._cacheEquipos = OrderedDict()
        self._cacheSessionResults = OrderedDict()
        self._cacheLaps = OrderedDict()
        self._cacheNeumaticos = OrderedDict()

    def fetch_carreras(self, year):
        url = f"{BASE_URL}/sessions?year={year}&session_type=Race&session_name=Race"

        try:
            response = requests.get(url)
            response.raise_for_status()
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
            response.raise_for_status()
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
            response.raise_for_status()
            data = response.json()
            return data
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_equipos(self, session_key):
        if session_key in self._cacheEquipos:
            data = self._cacheEquipos[session_key]

            if time.time() - data["expiracion"] < TIEMPO_LIMITE:
                return data["payload"]

        url = f"{BASE_URL}/championship_teams?session_key={session_key}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            self._cacheEquipos[session_key] = {
                "payload": data,
                "expiracion": time.time()
            }

            return data
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_session_resultado_por_drivers(self, session_key, driver_numbers):
        params = []
        for num in driver_numbers:
            texto = f"driver_number={num}"
            params.append(texto)

        query = "&".join(params)
        cache_key = f"{session_key}:{query}"

        if cache_key in self._cacheSessionResults:
            data = self._cacheSessionResults[cache_key]

            if time.time() - data["expiracion"] < TIEMPO_LIMITE:
                return data["payload"]

        url = f"{BASE_URL}/session_result?session_key={session_key}&{query}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            self._cacheSessionResults[cache_key] = {
                "payload": data,
                "expiracion": time.time()
            }

            if len(self._cacheSessionResults) > MAX_CACHE_SESSION_RESULTS:
                self._cacheSessionResults.popitem(last=False)

            return data

        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_laps_por_driver(self, session_key, driver_number):
        cache_key = f"{session_key}:{driver_number}"

        if cache_key in self._cacheLaps:
            data = self._cacheLaps[cache_key]

            if time.time() - data["expiracion"] < TIEMPO_LIMITE:
                return data["payload"]

        url = f"{BASE_URL}/laps?session_key={session_key}&driver_number={driver_number}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            self._cacheLaps[cache_key] = {
                "payload": data,
                "expiracion": time.time()
            }

            return data

        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

    def fetch_neumaticos_por_driver(self, session_key, driver_number):
        cache_key = f"{session_key}:{driver_number}"

        if cache_key in self._cacheNeumaticos:
            data = self._cacheNeumaticos[cache_key]

            if time.time() - data["expiracion"] < TIEMPO_LIMITE:
                return data["payload"]

        url = f"{BASE_URL}/stints?session_key={session_key}&driver_number={driver_number}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            self._cacheNeumaticos[cache_key] = {
                "payload": data,
                "expiracion": time.time()
            }

            return data

        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return None

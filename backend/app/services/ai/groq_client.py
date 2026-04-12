from groq import Groq
from app.config import Config


def get_groq_client():
    if not Config.GROQ_API_KEY:
        raise ValueError("Error .env")

    return Groq(api_key=Config.GROQ_API_KEY)

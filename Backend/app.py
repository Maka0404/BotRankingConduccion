from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os

# --- INICIALIZACIÓN Y SEGURIDAD ---

# MUY IMPORTANTE: Leemos la clave desde la variable de entorno para seguridad.
API_KEY = os.getenv("GEMINI_API_KEY") 

if not API_KEY:
    # Si la clave no está configurada, terminamos la aplicación para evitar exponer credenciales.
    raise ValueError("ERROR: La variable de entorno GEMINI_API_KEY no está configurada.")

# Inicializa Flask
app = Flask(__name__)
# Habilita CORS: Permite que el frontend de React (otro puerto/dominio) acceda a esta API.
CORS(app) 

# Inicializa el cliente de Gemini.
try:
    client = genai.Client(api_key=API_KEY)
    # Definimos la instrucción del sistema para el bot (solo se hace una vez).
    SYSTEM_INSTRUCTION = "Eres Genial-O, un robot creado por el equipo de SouthPark, fuiste creado para dar asistencia a la gerencia de EDSA, tienes que hablar como robot, conciso y util."
except Exception as e:
    print(f"Error al inicializar el cliente Gemini: {e}")
    client = None # Si hay un error, el cliente queda nulo para manejo de errores.

# --- ENDPOINT DE CONVERSACIÓN ---

@app.route('/ask-bot', methods=['POST'])
def ask_bot():
    """
    Endpoint que recibe una pregunta del frontend y devuelve una respuesta de Gemini.
    """
    if not client:
        return jsonify({"error": "El servicio del bot no está disponible (error de inicialización de la API)."}), 503

    # 1. Obtener la pregunta del frontend
    data = request.get_json()
    user_question = data.get("question", "")

    if not user_question:
        return jsonify({"error": "No se proporcionó ninguna pregunta válida."}), 400

    try:
        # 2. Llamar al modelo de Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION
            ),
            contents=user_question,
        )
        
        # 3. Devolver la respuesta al frontend
        return jsonify({"answer": response.text})

    except Exception as e:
        # Manejar errores durante la llamada a la API (e.g., límites de tokens, errores internos)
        print(f"Error al llamar a la API de Gemini: {e}")
        return jsonify({"error": "Ocurrió un error interno al generar la respuesta del bot."}), 500

# --- EJECUCIÓN DEL SERVIDOR ---

if __name__ == '__main__':
    # Ejecutamos el servidor en modo debug en el puerto 5000 (por defecto)
    print("Iniciando servidor Flask en http://127.0.0.1:5000/ask-bot (POST)")
    app.run(debug=True, port=5000)

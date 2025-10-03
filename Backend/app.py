from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os
import csv
import psycopg2
from psycopg2.extras import RealDictCursor

# --- INICIALIZACIÓN Y SEGURIDAD ---

# Configuración de la base de datos PostgreSQL
DB_HOST = "localhost"
DB_NAME = "RankingConduccion"
DB_USER = "postgres"
DB_PASSWORD = "coconut"
DB_PORT = 5434

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

# --- FUNCIÓN AUXILIAR PARA CONECTAR A LA BASE DE DATOS ---

def get_db_connection():
    """
    Crea y devuelve una conexión a la base de datos PostgreSQL.
    """
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

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

# --- ENDPOINT PARA LEER REPORTES DESDE POSTGRESQL ---

@app.route('/reportes', methods=['GET'])
def get_reportes():
    """
    Endpoint que devuelve todos los reportes desde la base de datos PostgreSQL.
    """
    conn = get_db_connection()
    
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos."}), 503
    
    try:
        # Usamos RealDictCursor para obtener resultados como diccionarios
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Consulta SQL para obtener todos los reportes
        cur.execute("""
            SELECT 
                id,
                fecha,
                vehiculo,
                conduccion_peligrosa_puntos,
                puntos_peligrosos_100km,
                distancia_km,
                duracion_conduccion_h,
                vel_promedio_kmh,
                vel_max_kmh,
                duracion_exceso_velocidad_min,
                exceso_velocidad_pct,
                frenado_extremo,
                frenado_extremo_100km,
                frenado_brusco,
                frenado_brusco_100km,
                frenado_normal,
                frenado_normal_100km,
                aceleracion_brusca,
                aceleracion_brusca_100km,
                duracion_ralenti_min,
                ralenti_excesivo_pct
            FROM Reportes
            ORDER BY fecha DESC, vehiculo ASC
        """)
        
        reportes = cur.fetchall()
        
        # Convertir tipos de datos especiales a strings para JSON
        reportes_json = []
        for reporte in reportes:
            reporte_dict = dict(reporte)
            # Convertir DATE a string
            if reporte_dict.get('fecha'):
                reporte_dict['fecha'] = str(reporte_dict['fecha'])
            # Convertir TIME a string
            if reporte_dict.get('duracion_conduccion_h'):
                reporte_dict['duracion_conduccion_h'] = str(reporte_dict['duracion_conduccion_h'])
            if reporte_dict.get('duracion_exceso_velocidad_min'):
                reporte_dict['duracion_exceso_velocidad_min'] = str(reporte_dict['duracion_exceso_velocidad_min'])
            if reporte_dict.get('duracion_ralenti_min'):
                reporte_dict['duracion_ralenti_min'] = str(reporte_dict['duracion_ralenti_min'])
            
            reportes_json.append(reporte_dict)
        
        cur.close()
        conn.close()
        
        return jsonify(reportes_json), 200

    except Exception as e:
        if conn:
            conn.close()
        print(f"Error al consultar la base de datos: {e}")
        return jsonify({"error": f"Error al consultar reportes: {str(e)}"}), 500

# --- EJECUCIÓN DEL SERVIDOR ---

if __name__ == '__main__':
    # Ejecutamos el servidor en modo debug en el puerto 5000 (por defecto)
    print("Iniciando servidor Flask en http://127.0.0.1:5000/ask-bot (POST)")
    app.run(debug=True, port=5000)

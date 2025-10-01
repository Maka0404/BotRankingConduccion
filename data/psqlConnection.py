
# insert_reports_pg.py
# Script para leer "/mnt/data/data.csv", normalizar tipos y cargar registros en la tabla Reportes (PostgreSQL).
# Requisitos: pip install psycopg2-binary pandas
# Ajusta las variables de conexión abajo y ejecuta: python insert_reports_pg.py

import psycopg2
from psycopg2.extras import execute_batch
import pandas as pd
import sys

DB_HOST = "localhost"
DB_NAME = "RankingConduccion"
DB_USER = "postgres"
DB_PASSWORD = "coconut"
DB_PORT = 5434
CSV_PATH = "data/data.csv"
BATCH_SIZE = 500

COLUMNS = ['fecha', 'vehiculo', 'conduccion_peligrosa_puntos', 'puntos_peligrosos_100km', 'distancia_km', 'duracion_conduccion_h', 'vel_promedio_kmh', 'vel_max_kmh', 'duracion_exceso_velocidad_min', 'exceso_velocidad_pct', 'frenado_extremo', 'frenado_extremo_100km', 'frenado_brusco', 'frenado_brusco_100km', 'frenado_normal', 'frenado_normal_100km', 'aceleracion_brusca', 'aceleracion_brusca_100km', 'duracion_ralenti_min', 'ralenti_excesivo_pct']

INSERT_SQL = f"""
INSERT INTO Reportes (fecha, vehiculo, conduccion_peligrosa_puntos, puntos_peligrosos_100km, distancia_km, duracion_conduccion_h, vel_promedio_kmh, vel_max_kmh, duracion_exceso_velocidad_min, exceso_velocidad_pct, frenado_extremo, frenado_extremo_100km, frenado_brusco, frenado_brusco_100km, frenado_normal, frenado_normal_100km, aceleracion_brusca, aceleracion_brusca_100km, duracion_ralenti_min, ralenti_excesivo_pct)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

def to_nullable_float(s):
    if s is None:
        return None
    s = str(s).strip()
    if s == "" or s.lower() == "nan":
        return None
    try:
        return float(s)
    except:
        return None

def to_nullable_int_from_float_string(s):
    if s is None:
        return None
    s = str(s).strip()
    if s == "" or s.lower() == "nan":
        return None
    try:
        f = float(s)
        return int(f)
    except:
        return None

def to_date_string(s):
    if s is None:
        return None
    s = str(s).strip()
    if s == "" or s.lower() == "nan":
        return None
    try:
        dt = pd.to_datetime(s, errors="coerce")
        if pd.isna(dt):
            return None
        return dt.strftime("%Y-%m-%d")
    except:
        return None

def to_time_string(s):
    if s is None:
        return None
    s = str(s).strip()
    if s == "" or s.lower() == "nan":
        return None
    parts = s.split(":")
    if len(parts) == 3:
        try:
            hh = int(float(parts[0])); mm = int(float(parts[1])); ss = int(float(parts[2]))
            return f"{hh:02d}:{mm:02d}:{ss:02d}"
        except:
            return None
    try:
        td = pd.to_timedelta(s)
        total_seconds = int(td.total_seconds())
        hh = total_seconds // 3600
        mm = (total_seconds % 3600) // 60
        ss = total_seconds % 60
        return f"{hh:02d}:{mm:02d}:{ss:02d}"
    except:
        return None

def normalize_row(row):
    # Devuelve una tupla con los valores en el mismo orden que COLUMNS
    vals = []
    for c in COLUMNS:
        v = row.get(c, None)
        if c in ['frenado_extremo', 'frenado_brusco', 'frenado_normal', 'aceleracion_brusca', 'vel_max_kmh']:
            vals.append(to_nullable_int_from_float_string(v))
        elif c in ['conduccion_peligrosa_puntos', 'puntos_peligrosos_100km', 'distancia_km', 'vel_promedio_kmh', 'exceso_velocidad_pct', 'frenado_extremo_100km', 'frenado_brusco_100km', 'frenado_normal_100km', 'aceleracion_brusca_100km', 'ralenti_excesivo_pct']:
            vals.append(to_nullable_float(v))
        elif c in ['fecha']:
            vals.append(to_date_string(v))
        elif c in ['duracion_conduccion_h', 'duracion_exceso_velocidad_min', 'duracion_ralenti_min']:
            vals.append(to_time_string(v))
        else:
            # cadenas (vehiculo)
            if v is None:
                vals.append(None)
            else:
                s = str(v).strip()
                vals.append(s if s != "" and s.lower() != "nan" else None)
    return tuple(vals)

def main():
    try:
        df = pd.read_csv(CSV_PATH, dtype=str)
    except Exception as e:
        print("Error leyendo CSV:", e); sys.exit(1)

    # Verificar columnas
    missing = [c for c in COLUMNS if c not in df.columns]
    if missing:
        print("Faltan columnas en el CSV:", missing); sys.exit(1)

    rows = [normalize_row(row) for _, row in df[COLUMNS].iterrows()]

    try:
        conn = psycopg2.connect(
            host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT
        )
        cur = conn.cursor()
        print("Conexión establecida.")
    except Exception as e:
        print("Error conectando a PostgreSQL:", e); sys.exit(1)

    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS Reportes (
                id SERIAL PRIMARY KEY,
                fecha DATE NOT NULL,
                vehiculo VARCHAR(100) NOT NULL,
                conduccion_peligrosa_puntos FLOAT,
                puntos_peligrosos_100km FLOAT,
	            distancia_km FLOAT,
	            duracion_conduccion_h TIME,
	            vel_promedio_kmh FLOAT,
	            vel_max_kmh INT,
	            duracion_exceso_velocidad_min TIME,
	            exceso_velocidad_pct FLOAT,
	            frenado_extremo INT,
	            frenado_extremo_100km FLOAT,
	            frenado_brusco INT,
	            frenado_brusco_100km FLOAT,
	            frenado_normal INT,
	            frenado_normal_100km FLOAT,
	            aceleracion_brusca INT,
	            aceleracion_brusca_100km FLOAT,
	            duracion_ralenti_min TIME,
	            ralenti_excesivo_pct FLOAT
            );
        """)
        conn.commit()
        print(f"Tabla Reportes creada.")
    except Exception as e:
        conn.rollback()
        print("Error durante la creación de la tabla Reportes", e)

    try:
        execute_batch(cur, INSERT_SQL, rows, page_size=BATCH_SIZE)
        conn.commit()
        print(f"Inserción completada. Registros insertados: {len(rows)}")
    except Exception as e:
        conn.rollback()
        print("Error durante la inserción. Se hizo rollback.", e)
    finally:
        cur.close(); conn.close()

if __name__ == '__main__':
    main()

import pandas as pd
import numpy as np
import glob
import os
import re
from difflib import SequenceMatcher

# --- configuración básica ---
INPUT_DIR = "baseData"
OUTPUT_FILE = "data.csv"

TARGET_COLS = [
    "fecha", "vehiculo", "conduccion_peligrosa_puntos", "puntos_peligrosos_100km",
    "distancia_km", "duracion_conduccion_h", "vel_promedio_kmh", "vel_max_kmh",
    "duracion_exceso_velocidad_min", "exceso_velocidad_pct", "frenado_extremo",
    "frenado_extremo_100km", "frenado_brusco", "frenado_brusco_100km",
    "frenado_normal", "frenado_normal_100km", "aceleracion_brusca",
    "aceleracion_brusca_100km", "duracion_ralenti_min", "ralenti_excesivo_pct"
]

COLUMN_KEYWORDS = {
    "vehiculo": ["vehicle", "vehiculo", "objeto"],
    "conduccion_peligrosa_puntos": ["dangerous driving (points)", "dangerous driving", "conduccion peligrosa", "puntos"],
    "puntos_peligrosos_100km": ["points/100km", "points per 100km", "points 100km", "points p/100km"],
    "distancia_km": ["distance (km)", "distancia", "distance", "km"],
    "duracion_conduccion_h": ["driving duration", "duration driving", "duracion conduccion", "duration (h)"],
    "vel_promedio_kmh": ["average speed", "avg speed", "average speed (km/h)", "velocidad media"],
    "vel_max_kmh": ["maximum speed", "max speed", "velocidad maxima"],
    "duracion_exceso_velocidad_min": ["duration overspeed", "excess speed duration", "duration (min)"],
    "exceso_velocidad_pct": ["excess idling (%)", "excess speed (%)", "excess speed %", "exceso velocidad"],
    "frenado_extremo": ["extreme braking", "hard braking", "frenado extremo"],
    "frenado_extremo_100km": ["extreme braking (events/100km)", "extreme braking/100km", "extreme braking 100km"],
    "frenado_brusco": ["severe braking", "frenado brusco"],
    "frenado_brusco_100km": ["severe braking (events/100km)", "brusco 100km"],
    "frenado_normal": ["normal braking", "frenado normal"],
    "frenado_normal_100km": ["normal braking (events/100km)"],
    "aceleracion_brusca": ["sudden acceleration", "aceleracion brusca"],
    "aceleracion_brusca_100km": ["sudden acceleration (events/100km)"],
    "duracion_ralenti_min": ["idling duration", "idle duration", "duracion ralenti"],
    "ralenti_excesivo_pct": ["excess idling (%)", "excess idling pct", "ralenti excesivo"]
}

# --- helpers ---
def _normalize_str(s: str) -> str:
    s = (s or "")
    s = s.replace('\xa0', ' ')
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def _sim(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()

def merge_repeated_rows(df: pd.DataFrame, vehicle_col: str) -> pd.DataFrame:
    to_drop = []
    i = 0
    n = len(df)
    while i < n - 1:
        if pd.notna(df.at[i, vehicle_col]) and pd.isna(df.at[i+1, vehicle_col]):
            for col in df.columns:
                if pd.isna(df.at[i, col]) and pd.notna(df.at[i+1, col]):
                    df.at[i, col] = df.at[i+1, col]
            to_drop.append(i+1)
            i += 2
        else:
            i += 1
    if to_drop:
        df = df.drop(index=to_drop).reset_index(drop=True)
    return df

def map_columns_robust(df: pd.DataFrame):
    src_cols = list(df.columns)
    src_norm = {c: _normalize_str(c) for c in src_cols}
    mapping = {}
    for target in TARGET_COLS:
        if target == "fecha":
            continue
        keywords = COLUMN_KEYWORDS.get(target, [])
        kw_norms = [_normalize_str(k) for k in keywords]
        best_score = 0.0
        best_src = None
        for src, sn in src_norm.items():
            matched = any(kw in sn and kw != "" for kw in kw_norms)
            if matched:
                best_src = src
                best_score = 1.0
                break
            for kw in kw_norms:
                if kw == "":
                    continue
                kw_toks = kw.split()
                if kw_toks and sum(1 for t in kw_toks if t in sn) >= max(1, len(kw_toks)//1):
                    sc = 0.95
                    if sc > best_score:
                        best_score = sc
                        best_src = src
            for kw in kw_norms + [_normalize_str(target)]:
                sc = _sim(sn, kw)
                if sc > best_score:
                    best_score = sc
                    best_src = src
            if '100' in sn and '100' in ' '.join(kw_norms):
                if 0.6 > best_score:
                    best_score = 0.7
                    best_src = src
        if best_score >= 0.55:
            mapping[target] = best_src
        else:
            mapping[target] = None

    df_out = pd.DataFrame(index=df.index)
    for target in TARGET_COLS:
        if target == "fecha":
            continue
        src = mapping.get(target)
        if src is not None:
            df_out[target] = df[src]
        else:
            df_out[target] = np.nan
    return df_out, mapping

def process_single_file(filepath: str):
    df = pd.read_csv(filepath, sep=';', dtype=str, encoding='utf-8', keep_default_na=False)
    df.columns = [c.strip() for c in df.columns]
    # Normalizar celdas
    df = df.applymap(lambda x: np.nan if (x is None or (isinstance(x, str) and _normalize_str(x) == "")) else (x.replace('\xa0',' ').strip() if isinstance(x, str) else x))
    # identificar columna vehicle
    vehicle_col = None
    for c in df.columns:
        cn = _normalize_str(c)
        if "vehicle" in cn or "vehiculo" in cn or "objeto" in cn:
            vehicle_col = c
            break
    if vehicle_col is None and len(df.columns) > 0:
        vehicle_col = df.columns[0]

    # ---- NUEVO: eliminar filas "Total" ----
    if vehicle_col is not None:
        # eliminar cualquier fila cuyo valor normalizado del campo vehicle sea 'total'
        mask_total = df[vehicle_col].apply(lambda v: isinstance(v, str) and re.fullmatch(r'\s*total\s*', v, flags=re.IGNORECASE) is not None)
        if mask_total.any():
            df = df[~mask_total].reset_index(drop=True)

    # fusionar filas repetidas (si existen)
    if vehicle_col:
        df = merge_repeated_rows(df, vehicle_col)

    # mapear columnas
    df_mapped, mapping = map_columns_robust(df)
    # extraer fecha del nombre de archivo
    m = re.search(r'(\d{4}-\d{2}-\d{2})', os.path.basename(filepath))
    fecha = m.group(1) if m else pd.to_datetime(os.path.getmtime(filepath), unit='s').strftime("%Y-%m-%d")
    df_mapped.insert(0, "fecha", fecha)
    return df_mapped, mapping

def combinar_todos_mejorado(input_dir=INPUT_DIR, output_file=OUTPUT_FILE):
    files = sorted(glob.glob(os.path.join(input_dir, "*.csv")))
    partes = []
    mappings_por_archivo = {}
    for f in files:
        df_map, mapping = process_single_file(f)
        mappings_por_archivo[os.path.basename(f)] = mapping
        df_map = df_map.reindex(columns=TARGET_COLS)
        partes.append(df_map)
    if not partes:
        raise RuntimeError("No se encontraron archivos CSV en la carpeta.")
    combinado = pd.concat(partes, ignore_index=True)
    combinado.to_csv(output_file, index=False)
    print(f"Guardado: {output_file}  (filas totales: {len(combinado)})")
    return combinado, mappings_por_archivo

# Uso:
combinado_df, mapas = combinar_todos_mejorado()
print(combinado_df.head())
for f, m in mapas.items(): print(f, m)

const TablaConductores = ({ data }) => {
  // Orden de las columnas según la estructura de la base de datos (sin ID)
  const columnOrder = [
    "fecha",
    "vehiculo",
    "conduccion_peligrosa_puntos",
    "puntos_peligrosos_100km",
    "distancia_km",
    "duracion_conduccion_h",
    "vel_promedio_kmh",
    "vel_max_kmh",
    "duracion_exceso_velocidad_min",
    "exceso_velocidad_pct",
    "frenado_extremo",
    "frenado_extremo_100km",
    "frenado_brusco",
    "frenado_brusco_100km",
    "frenado_normal",
    "frenado_normal_100km",
    "aceleracion_brusca",
    "aceleracion_brusca_100km",
    "duracion_ralenti_min",
    "ralenti_excesivo_pct"
  ];

  // Mapeo de nombres técnicos a nombres amigables en español
  const columnNames = {
    fecha: "Fecha",
    vehiculo: "Vehículo",
    conduccion_peligrosa_puntos: "Puntos de riesgo",
    puntos_peligrosos_100km: "Puntos de riesgo/100km",
    distancia_km: "Distancia recorrida (km)",
    duracion_conduccion_h: "Duración de trayecto (h)",
    vel_promedio_kmh: "Vel. Promedio (km/h)",
    vel_max_kmh: "Vel. Máxima (km/h)",
    duracion_exceso_velocidad_min: "Exceso Vel. (minutos)",
    exceso_velocidad_pct: "Exceso Vel. (%)",
    frenado_extremo: "Frenados Extremos",
    frenado_extremo_100km: "Frenados Ext./100km",
    frenado_brusco: "Frenados Bruscos",
    frenado_brusco_100km: "Frenados Brus./100km",
    frenado_normal: "Frenados Normales",
    frenado_normal_100km: "Frenados Norm./100km",
    aceleracion_brusca: "Aceleraciones Bruscas",
    aceleracion_brusca_100km: "Aceleraciones Brus./100km",
    duracion_ralenti_min: "Ralentí (minutos)",
    ralenti_excesivo_pct: "Ralentí Excesivo (%)"
  };

  if (!data || data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            {columnOrder.map((key) => (
              <th
                key={key}
                style={{
                  borderBottom: "2px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {columnNames[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columnOrder.map((key) => (
                <td
                  key={key}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaConductores;

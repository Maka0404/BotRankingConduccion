const TablaConductores = ({ data }) => {
  // Mapeo de nombres técnicos a nombres amigables en español
  const columnNames = {
    id: "ID",
    fecha: "Fecha",
    vehiculo: "Vehículo",
    conduccion_peligrosa_puntos: "Puntos Peligrosos",
    puntos_peligrosos_100km: "Puntos/100km",
    distancia_km: "Distancia (km)",
    duracion_conduccion_h: "Duración (h)",
    vel_promedio_kmh: "Vel. Promedio (km/h)",
    vel_max_kmh: "Vel. Máxima (km/h)",
    duracion_exceso_velocidad_min: "Exceso Vel. (min)",
    exceso_velocidad_pct: "Exceso Vel. (%)",
    frenado_extremo: "Frenados Extremos",
    frenado_extremo_100km: "Frenados Ext./100km",
    frenado_brusco: "Frenados Bruscos",
    frenado_brusco_100km: "Frenados Brus./100km",
    frenado_normal: "Frenados Normales",
    frenado_normal_100km: "Frenados Norm./100km",
    aceleracion_brusca: "Aceleraciones Bruscas",
    aceleracion_brusca_100km: "Aceleraciones/100km",
    duracion_ralenti_min: "Ralentí (min)",
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
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                style={{
                  borderBottom: "2px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {columnNames[key] || key.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td
                  key={i}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {value}
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

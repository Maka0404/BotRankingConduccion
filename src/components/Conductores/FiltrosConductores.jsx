import { useState } from "react";

const FiltrosConductores = ({ onFilter }) => {
  const [fecha, setFecha] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("");
  const [tipoOrden, setTipoOrden] = useState("desc");

  const handleBuscar = () => {
    onFilter({ fecha, vehiculo, ordenarPor, tipoOrden });
  };

  const handleLimpiar = () => {
    setFecha("");
    setVehiculo("");
    setOrdenarPor("");
    setTipoOrden("desc");
    onFilter({ fecha: "", vehiculo: "", ordenarPor: "", tipoOrden: "desc" });
  };

  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* Primera fila: Fecha y Vehículo */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Fecha:</label>
            <input
              type="date"
              value={fecha}
              autoComplete="off"
              onChange={(e) => setFecha(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Vehículo:</label>
            <input
              type="text"
              placeholder="Ej: Objeto 1"
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Segunda fila: Ordenamiento */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Ordenar por:</label>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
                minWidth: "250px",
              }}
            >
              <option value="">-- Sin ordenar --</option>
              <option value="puntos_peligrosos_100km">Puntos de riesgo por 100km</option>
              <option value="exceso_velocidad_pct">Exceso de velocidad (%)</option>
              <option value="frenado_extremo_100km">Frenados extremos por 100km</option>
              <option value="frenado_brusco_100km">Frenados bruscos por 100km</option>
              <option value="aceleracion_brusca_100km">Aceleraciones bruscas por 100km</option>
              <option value="ralenti_excesivo_pct">Ralentí excesivo (%)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px" }}></label>
            <select
              value={tipoOrden}
              onChange={(e) => setTipoOrden(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minWidth: "150px",
              }}
            >
              <option value="desc">Descendente (Mayor a Menor)</option>
              <option value="asc">Ascendente (Menor a Mayor)</option>
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleBuscar}
              style={{
                background: "#d8c8f0",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Buscar
            </button>
            <button
              onClick={handleLimpiar}
              style={{
                background: "#d8c8f0",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltrosConductores;

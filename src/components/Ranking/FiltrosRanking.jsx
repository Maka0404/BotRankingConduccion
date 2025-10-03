import { useState } from "react";

const FiltrosRanking = ({ onFilter }) => {
  const [vehiculo, setVehiculo] = useState("");

  const handleBuscar = () => {
    onFilter({ vehiculo });
  };

  const handleLimpiar = () => {
    setVehiculo("");
    onFilter({ vehiculo: "" });
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Input único */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <label>Vehículo:</label>
            <input
              type="text"
              placeholder="Ej:  Objeto 1"
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
            />
          </div>
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
  );
};

export default FiltrosRanking;

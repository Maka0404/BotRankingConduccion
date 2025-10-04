import { useState, useEffect } from "react";
import FiltrosConductores from "./FiltrosConductores";
import TablaConductores from "./TablaConductores";

const ConductoresPage = () => {
  const [data, setData] = useState([]);
  const [backupData, setBackupData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/reportes")
      .then((res) => res.json())
      .then((info) => {
        console.log("Datos cargados desde backend:", info);
        setData(info);
        setBackupData(info);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      });
  }, []);

  const handleFiltro = ({ fecha, vehiculo, ordenarPor, tipoOrden }) => {
    let filtrados = [...backupData];

    // Aplicar filtros de fecha y vehículo
    if (fecha && fecha !== "") {
      filtrados = filtrados.filter((item) => item.fecha === fecha);
    }

    if (vehiculo && vehiculo.trim() !== "") {
      filtrados = filtrados.filter((item) =>
        item.vehiculo.toLowerCase().includes(vehiculo.toLowerCase())
      );
    }

    // Aplicar ordenamiento si se seleccionó un campo
    if (ordenarPor && ordenarPor !== "") {
      filtrados.sort((a, b) => {
        const valorA = parseFloat(a[ordenarPor]) || 0;
        const valorB = parseFloat(b[ordenarPor]) || 0;
        
        if (tipoOrden === "asc") {
          return valorA - valorB; // Ascendente
        } else {
          return valorB - valorA; // Descendente
        }
      });
    }

    setData(filtrados);
  };

  return (
    <div>
      <FiltrosConductores onFilter={handleFiltro} />
      <TablaConductores data={data} />
    </div>
  );
};

export default ConductoresPage;

import { useState, useEffect } from "react";
import FiltrosRanking from "./FiltrosRanking";
import RankingTabla from "./RankingTabla";

const RankingPage = () => {
  const [data, setData] = useState([]);
  const [backupData, setBackupData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/reportes")
      .then((res) => res.json())
      .then((info) => {
        console.log("Datos cargados desde backend (ranking):", info);
        setData(info);
        setBackupData(info);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      });
  }, []);

  const handleFiltro = ({ vehiculo }) => {
    let filtrados = backupData;

    if (vehiculo && vehiculo.trim() !== "") {
      filtrados = filtrados.filter((item) =>
        (item.vehiculo || "").toLowerCase().includes(vehiculo.toLowerCase())
      );
    }

    setData(filtrados);
  };

  return (
    <div>
      <FiltrosRanking onFilter={handleFiltro} />
      <RankingTabla data={data} />
    </div>
  );
};

export default RankingPage;

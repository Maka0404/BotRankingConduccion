import { useState } from "react";
import FiltrosConductores from "./FiltrosConductores";
import TablaConductores from "./TablaConductores";

const ConductoresPage = () => {
  const datosIniciales = [
    {
      fecha: "2025-01-10",
      vehiculo: "ABC-123",
      conduccion_peligrosa_puntos: 5,
      puntos_peligrosos_100km: 2.5,
      distancia_km: 120,
      duracion_conduccion_h: 3,
      vel_promedio_kmh: 80,
      vel_max_kmh: 120,
      duracion_exceso_velocidad_min: 10,
      exceso_velocidad_pct: 1,  
      frenado_extremo: 1,
      frenado_extremo_100km: 1,
      frenado_brusco: 1,
      frenado_brusco_100km: 1,
      frenado_normal: 1,
      frenado_normal_100km: 1,
      aceleracion_brusca: 1,
      aceleracion_brusca_100km: 1,
      duracion_ralenti_min: 1,
      ralenti_excesivo_pct: 1,
    },
    {
      fecha: "2025-01-11",
      vehiculo: "XYZ-789",
      conduccion_peligrosa_puntos: 3,
      puntos_peligrosos_100km: 1.4,
      distancia_km: 95,
      duracion_conduccion_h: 2.5,
      vel_promedio_kmh: 75,
      vel_max_kmh: 110,
      duracion_exceso_velocidad_min: 5,
      exceso_velocidad_pct: 1,
      frenado_extremo: 1,
      frenado_extremo_100km: 1,
      frenado_brusco: 1,
      frenado_brusco_100km: 1,
      frenado_normal: 1,
      frenado_normal_100km: 1,
      aceleracion_brusca: 1,
      aceleracion_brusca_100km: 1,
      duracion_ralenti_min: 1,
      ralenti_excesivo_pct: 1,
    },
  ];

  const [data, setData] = useState(datosIniciales);

  const normalizeDateToYYYYMMDD = (value) => {
    if (!value && value !== 0) return "";
    if (value instanceof Date && !isNaN(value)) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value !== "string") {
      try {
        const d = new Date(value);
        if (!isNaN(d)) return d.toISOString().slice(0, 10);
      } catch (e) {
        return "";
      }
    }

    const s = value.trim();

    const isoMatch = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

    const dmy = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;

    const parsed = new Date(s);
    if (!isNaN(parsed)) return parsed.toISOString().slice(0, 10);

    return s;
  };

  const handleFiltro = ({ fecha, vehiculo }) => {

    let filtrados = datosIniciales;

    if (fecha && fecha !== "") {
      filtrados = filtrados.filter((item) => {
        const itemFecha = item.fecha;
        return itemFecha === fecha;
      });
    }

    if (vehiculo && vehiculo.trim() !== "") {
      filtrados = filtrados.filter((item) =>
        item.vehiculo.toLowerCase().includes(vehiculo.toLowerCase())
      );
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

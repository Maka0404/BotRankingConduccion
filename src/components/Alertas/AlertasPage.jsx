import { useMemo, useState } from "react";
import ListaAlertas from "./ListaAlertas";
import SubTabs from "../Tabs/SubTabs";

const styles = {
  wrap: { display: "grid", gap: 14 },
  pillsBar: {
    display: "flex", gap: 12, padding: 8,
    border: "1px solid #E5E7EB", borderRadius: 999, background: "#fff",
  },
  pill: (active) => ({
    padding: "10px 18px", borderRadius: 999, border: "1px solid #E5E7EB",
    background: active ? "#E9D5FF" : "#fff", fontWeight: 600,
  }),
  section: { border: "1px solid #E5E7EB", borderRadius: 10, padding: 14, background: "#FAFAFA" },
};

const INITIAL = [
  {
    id: "a1",
    title: "Múltiples infracciones",
    driverName: "Juan Pérez",
    severity: "high",
    summary:
      "8 infracciones en los últimos 12 meses.\nConsiderar entrenamiento adicional.",
    createdAt: "2024-08-19",
    status: "pending",
  },
  {
    id: "a2",
    title: "Exceso de velocidad",
    driverName: "María González",
    severity: "medium",
    summary:
      "Velocidad por encima del límite en 4 trayectos del último mes.",
    createdAt: "2024-09-06",
    status: "pending",
  },
  {
    id: "a3",
    title: "Ralentí excesivo",
    driverName: "Carlos Rodriguez",
    severity: "low",
    summary:
      "Ralentí > 10% del tiempo. Oportunidad de ahorro de combustible.",
    createdAt: "2024-06-19",
    status: "resolved",
  },
];

export default function AlertasPage() {
  const [subTab, setSubTab] = useState("pendientes");

  const statusFilter = subTab === "pendientes" ? "pending" : "resolved";
  const filtered = useMemo(
    () => INITIAL.filter((a) => a.status === statusFilter),
    [statusFilter]
  );

  return (
    <section style={styles.wrap}>
      <h2 style={{ margin: 0, fontSize: 28, color: "#1F2937" }}>
        Centro de Alertas
      </h2>

      <SubTabs subTab={subTab} setSubTab={setSubTab} />

      <div style={styles.section}>
        <ListaAlertas
          data={filtered}
          isLoading={false}
          isError={false}
          onViewDriver={(a) =>
            alert(`(demo) ver conductor: ${a.driverName}`)
          }
        />
      </div>
    </section>
  );
}

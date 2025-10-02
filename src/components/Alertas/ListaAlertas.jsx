import AlertaCard from "./AlertaCard";

export default function ListaAlertas({
  data,
  isLoading,
  isError,
  onViewDriver,
}) {
  if (isLoading) return <div style={{ padding: 8 }}>Cargando alertas…</div>;
  if (isError)
    return (
      <div style={{ padding: 8, color: "crimson" }}>
        Error al cargar.
      </div>
    );
  if (!data || data.length === 0)
    return <div style={{ padding: 8, opacity: 0.7 }}>No hay alertas.</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data.map((a) => (
        <div
          key={a.id}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: 10,
            background: "#fff",
          }}
        >
          <AlertaCard alert={a} onViewDriver={onViewDriver} />
        </div>
      ))}
    </div>
  );
}

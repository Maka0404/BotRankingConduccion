const SubTabs = ({ subTab, setSubTab }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <button
        onClick={() => setSubTab("pendientes")}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: subTab === "pendientes" ? "#d8c8f0" : "#fff",
          cursor: "pointer",
          fontWeight: subTab === "pendientes" ? "bold" : "normal",
        }}
      >
        Pendientes
      </button>

      <button
        onClick={() => setSubTab("resueltas")}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: subTab === "resueltas" ? "#d8c8f0" : "#fff",
          cursor: "pointer",
          fontWeight: subTab === "resueltas" ? "bold" : "normal",
        }}
      >
        Resueltas
      </button>
    </div>
  );
};

export default SubTabs;

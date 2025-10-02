const MainTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
      <button
        onClick={() => setActiveTab("conductores")}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: activeTab === "conductores" ? "#d8c8f0" : "#fff",
          fontWeight: activeTab === "conductores" ? "bold" : "normal",
          cursor: "pointer",
        }}
      >
        Conductores
      </button>

      <button
        onClick={() => setActiveTab("alertas")}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: activeTab === "alertas" ? "#d8c8f0" : "#fff",
          fontWeight: activeTab === "alertas" ? "bold" : "normal",
          cursor: "pointer",
        }}
      >
        Alertas
      </button>
    </div>
  );
};

export default MainTabs;

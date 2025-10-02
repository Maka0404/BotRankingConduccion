import { useState } from "react";
import MainTabs from "./components/Tabs/MainTabs";
import ConductoresPage from "./components/Conductores/ConductoresPage";
import AlertasPage from "./components/Alertas/AlertasPage";

function App() {
  const [activeTab, setActiveTab] = useState("conductores");

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      <MainTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "conductores" ? <ConductoresPage /> : <AlertasPage />}
    </div>
  );
}

export default App;

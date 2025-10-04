import ConductoresPage from "./components/Conductores/ConductoresPage";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ChatbotButtonAndWindow from './components/ChatbotButtonAndWindow'; // Importa el nuevo componente


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Menú superior */}
      <Navbar />

      {/* Contenido principal */}
      <main
        className="flex-grow"
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <ConductoresPage />
      </main>

      {/* ¡Agrega el componente del chat aquí! */}
      <ChatbotButtonAndWindow />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

import ConductoresPage from "./components/Conductores/ConductoresPage";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ChatbotButtonAndWindow from "./components/ChatbotButtonAndWindow";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
    
      <Navbar />

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

      <ChatbotButtonAndWindow />

      <Footer />
    </div>
  );
}

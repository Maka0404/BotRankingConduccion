import React, { useState } from 'react';

// URL del backend de Flask corriendo localmente
const API_URL = "http://127.0.0.1:5000/ask-bot"; 

// Estilos (manteniendo los estilos de objeto por simplicidad)
const chatStyles = {
  chatWindow: {
    position: 'fixed',
    bottom: '80px', 
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#333',
    border: '1px solid #555',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000, 
    color: '#eee',
  },
  chatHeader: {
    backgroundColor: '#444',
    padding: '10px',
    borderBottom: '1px solid #555',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  chatCloseButton: {
    background: 'none',
    border: 'none',
    color: '#eee',
    fontSize: '1.2em',
    cursor: 'pointer',
  },
  chatMessages: {
    flexGrow: 1,
    padding: '10px',
    overflowY: 'auto', 
    borderBottom: '1px solid #555',
    // Estilo para la barra de desplazamiento (opcional)
    scrollbarWidth: 'thin', 
    scrollbarColor: '#646cff #333',
  },
  chatInputContainer: {
    display: 'flex',
    padding: '10px',
  },
  chatInput: {
    flexGrow: 1,
    padding: '8px',
    border: '1px solid #555',
    borderRadius: '4px',
    backgroundColor: '#222',
    color: '#eee',
    marginRight: '5px',
  },
  chatSendButton: {
    padding: '8px 12px',
    backgroundColor: '#646cff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  floatingButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#646cff', 
    color: 'white',
    border: 'none',
    borderRadius: '50%', 
    width: '60px',
    height: '60px',
    fontSize: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    zIndex: 1001, 
  }
};

const ChatbotButtonAndWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el indicador de carga
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Soy UTECHY. Puedo brindarte información sobre UTEC, la universidad de ingeniería y tecnología. ¿Qué deseas saber?.", sender: "bot" }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // -------------------------------------------------------------------
  // FUNCIÓN CLAVE: Envía el mensaje al servidor Flask (Backend)
  // -------------------------------------------------------------------
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userQuestion = inputMessage.trim();
    
    // 1. Mostrar el mensaje del usuario y limpiar el input
    const newUserMessage = { id: Date.now(), text: userQuestion, sender: "user" };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true); // Activa el indicador de carga

    try {
        // 2. Llama a la API de Flask
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userQuestion }),
        });

        const data = await response.json();

        if (response.ok) {
            // 3. Recibe y muestra la respuesta de Gemini/UTECHY
            const botAnswer = data.answer;
            const botMessage = { id: Date.now() + 1, text: botAnswer, sender: "bot" };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } else {
            // Manejar errores del servidor Flask
            const errorMessage = data.error || "Error desconocido al hablar con el bot.";
            const errorMessageBot = { id: Date.now() + 1, text: `Error de la API: ${errorMessage}`, sender: "bot" };
            setMessages(prevMessages => [...prevMessages, errorMessageBot]);
        }
    } catch (error) {
        // Manejar errores de red/conexión (si Flask no está corriendo)
        console.error("Error al conectar con la API:", error);
        const errorMessageBot = { id: Date.now() + 1, text: "¡No pude conectar con UTECHY! Asegúrate de que el servidor Flask esté corriendo en el puerto 5000.", sender: "bot" };
        setMessages(prevMessages => [...prevMessages, errorMessageBot]);
    } finally {
        setIsLoading(false); // Desactiva el indicador de carga
    }
  };
  // -------------------------------------------------------------------

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button style={chatStyles.floatingButton} onClick={toggleChat}>
        💬
      </button>

      {/* Ventana del chat (condicionalmente renderizada) */}
      {isOpen && (
        <div style={chatStyles.chatWindow}>
          <div style={chatStyles.chatHeader}>
            <span>UTECHY 🤖</span>
            <button style={chatStyles.chatCloseButton} onClick={toggleChat}>
              &times; 
            </button>
          </div>
          <div style={chatStyles.chatMessages}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  textAlign: msg.sender === 'user' ? 'right' : 'left', 
                  marginBottom: '8px',
                  // Colores para diferenciar usuario y bot
                  color: msg.sender === 'user' ? '#99ccff' : '#eee', 
                  fontWeight: msg.sender === 'bot' ? '600' : '400'
                }}
              >
                {msg.text}
              </div>
            ))}
            {/* Indicador de que el bot está escribiendo */}
            {isLoading && (
                <div style={{ textAlign: 'left', fontStyle: 'italic', color: '#888', marginTop: '10px' }}>
                    UTECHY está procesando...
                </div>
            )}
          </div>
          <div style={chatStyles.chatInputContainer}>
            <input
              type="text"
              style={chatStyles.chatInput}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              // Deshabilita el input si está cargando una respuesta
              disabled={isLoading} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isLoading ? "Esperando respuesta..." : "Escribe un mensaje..."}
            />
            <button 
              style={chatStyles.chatSendButton} 
              onClick={handleSendMessage}
              disabled={isLoading} // Deshabilita el botón si está cargando
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButtonAndWindow;

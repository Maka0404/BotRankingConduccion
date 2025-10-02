# 🤖 BotRankingConduccion: Sistema de Clasificación de Conductores

Este proyecto tiene como objetivo crear un sistema de clasificación para conductores, con una arquitectura separada para el Front-end (interfaz de usuario) y el Back-end (lógica y procesamiento de datos).

## 🚀 Inicio Rápido

Para poner en marcha el proyecto, deberás ejecutar comandos por separado para la interfaz (Front-end) y el servidor (Back-end).

---

## 💻 Front-end (Equipo South Park)

El Front-end está desarrollado para ser la interfaz de usuario.

### Pre-requisitos
Asegúrate de tener **Node.js** y **npm** instalados.

### Instalación y Ejecución

1.  Abre tu terminal en la carpeta raíz del proyecto.
2.  Instala las dependencias de desarrollo, incluyendo Vite:

    ```bash
    npm install vite --save-dev
    ```

3.  Inicia el servidor de desarrollo del Front-end:

    ```bash
    npm run dev
    ```
    *Esto normalmente inicia el servidor en `http://localhost:5173` o similar.*

---

## ⚙️ Back-end (API y Lógica)

El Back-end maneja la lógica de la aplicación, el acceso a la API de Gemini y la comunicación con el Front-end.

### Pre-requisitos
Asegúrate de tener **Python** y **pip** instalados.

### Configuración del Entorno

1.  **Navega** al directorio del Back-end:

    ```bash
    cd Backend
    ```

2.  **Instala** las librerías necesarias de Python:

    ```bash
    pip install flask google-genai flask-cors
    ```

3.  **Configura tu Clave de API de Gemini:**
    Debes establecer tu clave como una variable de entorno.

    * **En Windows (PowerShell):**
        ```bash
        $env:GEMINI_API_KEY="AIzaSy...tu...clave"
        ```

    * **En Linux/macOS (Bash):**
        ```bash
        export GEMINI_API_KEY="AIzaSy...tu...clave"
        ```
    *Asegúrate de reemplazar el valor con tu clave real.*

### Ejecución del Servidor

Una vez configurado, ejecuta el servidor de la aplicación Flask:

```bash
python app.py
export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Usamos la clase simple 'navbar-list' para aplicar el CSS puro */}
        <ul className="navbar-list font-medium">
          
          {/* A 'Genial-O' le ponemos 'navbar-logo' para el 'margin-right: auto' */}
          <li className="navbar-logo text-2xl font-extrabold tracking-wide">
            <a href="#home" className="hover:text-yellow-300 transition-colors duration-300">
              Genial-O
            </a>
          </li>
            
          <li>
            <a href="#home" className="hover:text-yellow-300 transition-colors duration-300">
              Inicio
            </a>
          </li>
          
          <li>
            <a href="#about" className="hover:text-yellow-300 transition-colors duration-300">
              Acerca
            </a>
          </li>
          
          <li>
            <a href="#contact" className="hover:text-yellow-300 transition-colors duration-300">
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
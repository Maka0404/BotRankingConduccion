export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-10">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.</p>
        <p className="text-sm mt-2">Hecho con ❤️ en React</p>
      </div>
    </footer>
  );
}

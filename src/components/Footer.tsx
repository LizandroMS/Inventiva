export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-6 mt-auto">
      <div className="container mx-auto text-center px-4">
        <p className="text-lg font-semibold">© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
        
        {/* Navegación de enlaces */}
        <nav className="mt-4">
          <ul className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm sm:text-base">
            <li>
              <a href="/about" className="hover:underline hover:text-gray-200 transition-colors duration-300">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline hover:text-gray-200 transition-colors duration-300">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline hover:text-gray-200 transition-colors duration-300">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline hover:text-gray-200 transition-colors duration-300">
                Contáctanos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-6 mt-auto">
      <div className="container mx-auto text-center px-4">
        <p className="text-lg font-semibold">
          © 2024 Pollería El Sabrosito. Todos los derechos reservados.
        </p>

        {/* Navegación de enlaces */}
        <nav className="mt-4">
          <ul className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm sm:text-base">
            <li>
              <a
                href="/about"
                className="hover:underline hover:text-gray-200 transition-colors duration-300"
              >
                Sobre nosotros
              </a>
            </li>
            <li>
              <a
                href="/locales"
                className="hover:underline hover:text-gray-200 transition-colors duration-300"
              >
                Locales
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:underline hover:text-gray-200 transition-colors duration-300"
              >
                Términos y condiciones
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:underline hover:text-gray-200 transition-colors duration-300"
              >
                Política de privacidad
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:underline hover:text-gray-200 transition-colors duration-300"
              >
                Contáctanos
              </a>
            </li>
          </ul>
        </nav>

        {/* Redes sociales */}
        <div className="mt-6 flex justify-center space-x-6">
          <a
            href="https://www.instagram.com/elsabrositobarranca"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:text-gray-200 transition-colors duration-300"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.facebook.com/ElSabrositoBarranca"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-white hover:text-gray-200 transition-colors duration-300"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@polleriaelsabrosito"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-white hover:text-gray-200 transition-colors duration-300"
          >
            <FaTiktok size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

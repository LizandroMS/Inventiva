// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-green-700 text-white py-4 text-center mt-auto">
        <div className="container mx-auto">
          <p>© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
          <nav className="flex justify-center space-x-4 mt-2">
            <a href="/about" className="hover:underline">Sobre nosotros</a>
            <a href="/terms" className="hover:underline">Términos y condiciones</a>
            <a href="/privacy" className="hover:underline">Política de privacidad</a>
            <a href="/contact" className="hover:underline">Contáctanos</a>
          </nav>
        </div>
      </footer>
    );
  }
  
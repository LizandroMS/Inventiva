// src/app/page.tsx
import { PrismaClient, Product } from "@prisma/client";
import Image from "next/image";
import { Branch } from "@/types/branch";
import { Promotion } from "@/types/promotion";

const prisma = new PrismaClient();

export default async function Home() {
  // Obtener la primera sucursal (por defecto)
  const branch: Branch | null = await prisma.branch.findFirst();

  // Si no hay sucursal, maneja el error aquí
  if (!branch) {
    return <div>No se encontraron sucursales</div>;
  }

  // Obtener productos y promociones de la sucursal seleccionada
  const products: Product[] = await prisma.product.findMany({
    where: { branchId: branch.id },
  });

  const promotions: Promotion[] = await prisma.promotion.findMany({
    where: { branchId: branch.id },
  });

  return (
    <div>
      {/* Header */}
      <header className="bg-yellow-500 text-gray-900 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Pollería El Sabrosito</h1>
          <nav className="space-x-4">
            <a href="#" className="text-gray-900 hover:text-orange-500">Menú</a>
            <a href="#" className="text-gray-900 hover:text-orange-500">Promociones</a>
          </nav>
        </div>
      </header>

      {/* Selección de sucursal */}
      <section className="py-4 bg-gray-100">
        <div className="container mx-auto">
          <label htmlFor="branch-select" className="block mb-2 text-lg font-semibold text-gray-700">
            Selecciona una sucursal:
          </label>
          <select id="branch-select" className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option value={branch.id}>
              {branch.name} - {branch.address}
            </option>
            {/* Aquí puedes agregar más sucursales si lo deseas */}
          </select>
        </div>
      </section>

      {/* Sección de detalles de la pollería */}
      <section className="bg-white py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bienvenido a Pollería Inventiva - {branch.name}
          </h2>
          <p className="text-lg text-gray-700">
            La mejor pollería de la ciudad. ¡Ven a disfrutar del auténtico sabor
            del pollo a la brasa y más!
          </p>
          <Image src="/images/polleria.png" alt="Pollería" width={600} height={400} className="mx-auto my-4 rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Menú de productos */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Nuestro Menú en {branch.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-lg text-gray-700 mb-4">S/ {product.price}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-colors">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Promociones */}
      <section className="py-10 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Promociones Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-yellow-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{promo.title}</h3>
                <p className="text-lg text-gray-700 mb-4">{promo.description}</p>
                <p className="font-bold text-orange-600">S/ {promo.discount_price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-500 text-gray-900 p-4 text-center shadow-inner">
        <p className="text-lg font-semibold">© 2024 Pollería El Sabrosito. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

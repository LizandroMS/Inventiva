"use client"; // Añade esta línea para marcar este componente como un Client Component

import { createContext, useContext, useState, ReactNode } from "react";

// Definir la interfaz del producto
export interface Product {
  id: number;
  name: string;
  price: number;
  imagenUrl: string;
  quantity: number;
  promotional_price: number;
  description: string;
}

// Definir las propiedades del contexto
interface CartContextProps {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void; // Nueva función para actualizar la cantidad
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// Crear el contexto
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Añadir al carrito o actualizar la cantidad si ya existe
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: product.quantity } : item // Actualiza con la cantidad enviada
        );
      }
      return [...prevItems, { ...product, quantity: product.quantity }]; // Añadir con la cantidad especificada
    });
  };

  // Nueva función para actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item // Actualiza solo la cantidad del producto específico
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

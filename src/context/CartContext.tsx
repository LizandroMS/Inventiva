"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// Crear el contexto
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart)); // Intenta parsear solo si existe
      } catch (error) {
        console.error("Error al parsear carrito de localStorage", error);
      }
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que se actualice
  useEffect(() => {
    if (cartItems.length > 0) { // Asegurarse de que hay elementos para guardar
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems"); // Limpiar localStorage si el carrito está vacío
    }
  }, [cartItems]);

  // Añadir al carrito o actualizar la cantidad si ya existe
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Si el producto ya existe, actualiza la cantidad
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      // Si no existe, lo añade al carrito
      return [...prevItems, product];
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
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

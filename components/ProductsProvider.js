"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { subscribeToProducts } from "@/lib/products";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (nextProducts) => {
        setProducts(nextProducts);
        setLoading(false);
        setError("");
      },
      (nextError) => {
        console.error("Failed to subscribe to products:", nextError);
        setError(nextError?.message || "Unable to load products.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }

  return context;
}

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ProductCard, Product } from "../components/ProductCard";
import { CartDrawer, CartItem } from "../components/CartDrawer";

export default function StorefrontCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Fetches live product catalog from Backend Gateway
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {
        // Fallback demo fixtures
        setProducts([
          { id: "prod-1", name: "Apex Mechanical Keyboard", price: 129.99, description: "Wireless RGB keyboard with hot-swappable tactile switches.", category: "Hardware" },
          { id: "prod-2", name: "Precision Gaming Mouse", price: 79.99, description: "Ultra-lightweight 26k DPI optical sensor with zero latency.", category: "Hardware" },
          { id: "prod-3", name: "Developer Noise-Canceling Headset", price: 199.99, description: "Spatial audio with AI acoustic noise reduction mic.", category: "Audio" }
        ]);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogin={() => alert("Redirecting to Auth Service /login...")}
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Featured Hardware & Gear</h1>
          <p className="text-xs text-zinc-400">Streamlined e-commerce frontend connected to Fastify backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => window.location.href = "/checkout"}
      />
    </div>
  );
}

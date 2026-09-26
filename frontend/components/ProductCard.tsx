export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
      <div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
          {product.category}
        </span>
        <h3 className="font-semibold text-sm text-zinc-100 mt-2">{product.name}</h3>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
        <span className="font-mono text-sm font-bold text-cyan-400">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAddToCart(product)}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

import { Product } from "./ProductCard";

export interface CartItem extends Product {
  quantity: number;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onCheckout,
}: {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
}) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h2 className="text-base font-semibold text-white">Your Shopping Cart</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white text-sm">✕</button>
          </div>

          <div className="mt-4 space-y-3 overflow-y-auto max-h-[60vh]">
            {items.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div>
                    <h4 className="font-medium text-xs text-zinc-200">{item.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Total:</span>
            <span className="font-mono font-bold text-white text-base">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

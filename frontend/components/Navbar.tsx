export interface NavbarProps {
  cartCount: number;
  userEmail?: string;
  onOpenCart: () => void;
  onLogin: () => void;
}

export function Navbar({ cartCount, userEmail, onOpenCart, onLogin }: NavbarProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 text-white">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-cyan-400">⚡ ApexStore</span>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <a href="/" className="hover:text-white">Catalog</a>
          <a href="/checkout" className="hover:text-white">Checkout</a>
          <a href="/profile" className="hover:text-white">Orders</a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {userEmail ? (
          <span className="text-xs font-mono text-zinc-400">👤 {userEmail}</span>
        ) : (
          <button onClick={onLogin} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-lg">
            Sign In
          </button>
        )}
        <button onClick={onOpenCart} className="relative px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs rounded-lg font-medium">
          Cart ({cartCount})
        </button>
      </div>
    </header>
  );
}

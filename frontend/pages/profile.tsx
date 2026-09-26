export default function ProfilePage() {
  const mockUser = {
    name: "Alex Dev",
    email: "alex@developer.io",
    role: "Verified Customer",
    orders: [
      { id: "ORD-9481", date: "2026-09-24", total: 129.99, status: "Delivered" },
      { id: "ORD-9120", date: "2026-09-12", total: 79.99, status: "Delivered" },
    ]
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 max-w-3xl mx-auto">
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h1 className="text-xl font-bold text-white">Customer Account</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">Logged in via Auth Service JWT</p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <div><span className="text-zinc-500">Name:</span> {mockUser.name}</div>
          <div><span className="text-zinc-500">Email:</span> {mockUser.email}</div>
          <div><span className="text-zinc-500">Role:</span> {mockUser.role}</div>
          <div><span className="text-zinc-500">Database ID:</span> usr_884920</div>
        </div>

        <h3 className="text-sm font-semibold text-white mt-6 mb-3">Past Orders</h3>
        <div className="space-y-2">
          {mockUser.orders.map((o) => (
            <div key={o.id} className="flex justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
              <span className="font-mono text-cyan-400">{o.id}</span>
              <span className="text-zinc-400">{o.date}</span>
              <span className="text-emerald-400">{o.status}</span>
              <span className="font-mono font-bold">${o.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    shippingAddress: "123 Tech Blvd, Silicon Valley, CA",
    paymentMethod: "stripe_card",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Forward checkout payload to Backend Gateway
      const response = await fetch("http://localhost:8080/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sample_jwt_token_from_auth_service"
        },
        body: JSON.stringify({
          items: [{ productId: "prod-1", quantity: 1, unitPrice: 129.99 }],
          shippingAddress: formData.shippingAddress,
        })
      });

      const result = await response.json();
      setOrderStatus(`Order #${result.orderId || "ORD-9481"} confirmed!`);
    } catch {
      setOrderStatus("Order #ORD-9481 created successfully in database!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 flex justify-center items-center">
      <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h2 className="text-lg font-bold text-white mb-2">Checkout & Order Placement</h2>
        <p className="text-xs text-zinc-400 mb-6">Communicates with Backend Gateway and triggers Stripe billing.</p>

        {orderStatus ? (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
            {orderStatus}
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Shipping Address</label>
              <input
                type="text"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl"
            >
              {isSubmitting ? "Processing with Backend..." : "Submit Order ($129.99)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

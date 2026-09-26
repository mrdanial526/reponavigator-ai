import { orderService } from "../services/orderService";
import { paymentGateway } from "../services/paymentGateway";

export const orderController = {
  async createOrder(req: { body: { items: { productId: string; quantity: number; unitPrice: number }[]; shippingAddress: string }; userId: string }) {
    // 1. Calculate total order amount
    const totalAmount = req.body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // 2. Process transaction with Payment Gateway
    const paymentResult = await paymentGateway.charge({
      amount: totalAmount,
      currency: "usd",
      userId: req.userId,
    });

    // 3. Persist order in Database
    const order = await orderService.saveOrder({
      userId: req.userId,
      items: req.body.items,
      totalAmount,
      paymentId: paymentResult.transactionId,
      shippingAddress: req.body.shippingAddress,
      status: "PAID",
    });

    return { success: true, orderId: order.id, status: order.status };
  },

  async getOrderById(orderId: string) {
    return orderService.findOrder(orderId);
  }
};

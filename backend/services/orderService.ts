export interface OrderRecord {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  paymentId: string;
  shippingAddress: string;
  status: "PENDING" | "PAID" | "SHIPPED";
  createdAt: string;
}

export const orderService = {
  async saveOrder(data: Omit<OrderRecord, "id" | "createdAt">): Promise<OrderRecord> {
    const newOrder: OrderRecord = {
      id: `ord_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...data,
    };

    // SQL / Prisma call to Database
    console.log(`[Database] Inserted order #${newOrder.id} for user ${newOrder.userId}`);
    return newOrder;
  },

  async findOrder(orderId: string): Promise<OrderRecord | null> {
    console.log(`[Database] SELECT * FROM orders WHERE id = '${orderId}'`);
    return {
      id: orderId,
      userId: "usr_alex_dev",
      items: [{ productId: "prod-1", quantity: 1, unitPrice: 129.99 }],
      totalAmount: 129.99,
      paymentId: "pi_stripe_398240",
      shippingAddress: "123 Tech Blvd, Silicon Valley, CA",
      status: "PAID",
      createdAt: "2026-09-24T12:00:00Z"
    };
  }
};

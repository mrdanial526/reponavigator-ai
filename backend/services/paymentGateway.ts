export interface ChargeOptions {
  amount: number;
  currency: string;
  userId: string;
}

export const paymentGateway = {
  async charge(options: ChargeOptions): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[Stripe SDK] Creating payment intent for $${options.amount.toFixed(2)} ${options.currency.toUpperCase()}`);
    // Simulated Stripe PaymentIntent API response
    return {
      success: true,
      transactionId: `tx_stripe_${Math.random().toString(36).substring(2, 10)}`,
    };
  }
};

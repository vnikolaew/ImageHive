import Stripe from "stripe";

export class StripeService {
   stripe: Stripe;

   constructor() {
      this.stripe = new Stripe(process.env.STRIPE_API_KEY!);
   }

   async getCheckoutSession(id: string) {
      const session = await this.stripe.checkout
         .sessions
         .retrieve(id);
      return session;

   }

   async listProducts() {
      const products = await this.stripe.products.list({ limit: 10 });
      return products;
   }

   async listPrices() {
      const prices = await this.stripe.prices.list({ limit: 10 });
      return prices;
   }

   async listInvoice(invoiceId: string) {
      return await this.stripe.invoices.retrieve(invoiceId);
   }

   listPaymentLinks() {
      return this.stripe.paymentLinks.list({ limit: 10 });
   }
}

export const stripeService = new StripeService();
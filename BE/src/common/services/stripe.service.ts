import { ConfigService } from './config.service';
import { Stripe } from 'stripe';
import { PaymentConfig } from '../constants/constants';
import { ApiError } from '../classes/api-error';
import { Messages } from '../constants/messages';

export class StripeService {
  private readonly stripeConnection = new Stripe(
    this.configService.stripe.secretKey,
    {
      apiVersion: '2020-08-27',
    },
  );
  constructor(private configService: ConfigService) {}

  async createProduct(name: string) {
    return await this.stripeConnection.products.create({
      name,
    });
  }

  async createPrice({ unitAmount = 0, productId = '' }) {
    return await this.stripeConnection.prices.create({
      currency: PaymentConfig.currency,
      unit_amount: unitAmount,
      product: productId,
    });
  }

  async createPaymentIntent({ amount = 0, orderId = '', successUrl = '' }) {
    return await this.stripeConnection.paymentIntents.create({
      amount: amount,
      currency: PaymentConfig.currency,
      return_url: successUrl,
      metadata: { orderId },
      confirm: true,
    });
  }

  async createPaymentLink({ quantity = 0, priceId = '' }, successUrl: any) {
    const paymentObject = {
      line_items: [{ price: priceId, quantity }],
    };

    if (successUrl) {
      paymentObject['after_completion'] = {
        type: 'redirect',
        redirect: {
          url: successUrl,
        },
      };
    }

    return await this.stripeConnection.paymentLinks.create(paymentObject);
  }

  async constructEvent(data: any, sig: string) {
    try {
      return await this.stripeConnection.webhooks.constructEvent(
        data,
        sig,
        this.configService.stripe.hookSecretKey,
      );
    } catch (error) {
      throw new ApiError(Messages.INVALID_STRIPE_EVENT);
    }
  }
}

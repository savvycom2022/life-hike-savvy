import { ConfigService } from '../common/services/config.service';
import {
  Order,
  OrderDocument,
  OrderStatus,
} from '../database/schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from '../common/services/stripe.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Book, BookDocument } from '../database/schemas/book.schema';
import { PaymentEvents } from '../common/constants/constants';
import { ApiError } from '../common/classes/api-error';
import { Messages } from '../common/constants/messages';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async getCheckoutSession(order: Order) {
    try {
      const successUrl = `${this.configService.app.feUrl}/order-created`;
      const cancelUrl = `${this.configService.app.feUrl}/order-cancelled`;
      return await this.stripeService.stripe.checkout.sessions.create({
        line_items: [{ price: order.priceId, quantity: order.quantity }],
        cancel_url: cancelUrl,
        success_url: successUrl,
        mode: 'payment',
      });
    } catch (er) {
      console.log(er);
    }
  }

  async createOrder(data: CreateOrderDto) {
    try {
      const book = await this.bookModel.findOne({ _id: data.bookId });
      const order = new this.orderModel({
        bookId: book._id,
        priceId: book.priceId,
        productId: book.productId,
        username: data.username,
        phone: data.phone,
        status: OrderStatus.PENDING,
        quantity: 1,
      });

      const checkoutSession = await this.getCheckoutSession(order);
      order.paymentIntentId = checkoutSession.payment_intent as string;
      await order.save();

      return checkoutSession;
    } catch (error) {
      console.log(error);
      throw ApiError.error(Messages.CREATE_ORDER_FAILED);
    }
  }

  async processOrderHook(request: any) {
    const sig = request.headers['stripe-signature'];
    const event = await this.stripeService.constructEvent(request.rawBody, sig);
    console.log('@== event', event.data.object);
    try {
      switch (request.body?.type) {
        case PaymentEvents.CHECKOUT_COMPLETE:
          await this.checkoutCompleteEventHandler(event.data.object);
          break;
        case PaymentEvents.PAYMENT_INTENT_SUCCESS:
          await this.paymentIntentSuccessEventHandler(event.data.object);
          break;
        default:
      }
    } catch (err) {}

    return event;
  }

  async checkoutCompleteEventHandler(object: any) {
    const paymentIntentId = object?.payment_intent;
    const order = await this.orderModel.findOne({
      paymentIntentId,
    });

    if (order) {
      order.status = OrderStatus.DONE;
      order.paymentInfo = object;
      await order.save();
    }
  }

  async paymentIntentSuccessEventHandler(object: any) {
    const paymentIntentId = object?.payment_intent;
    const order = await this.orderModel.findOne({
      paymentIntentId,
    });

    console.log('@== paymentIntentId', paymentIntentId);
    console.log('@== order', order);
    if (order) {
      order.paymentIntent = object;
      await order.save();
    }
  }
}

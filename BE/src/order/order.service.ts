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
import { GetOrderDto } from './dtos/get-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async getCheckoutSession(order: OrderDocument) {
    const successUrl = `${this.configService.app.feUrl}/order-created/${order?._id}`;
    const cancelUrl = `${this.configService.app.feUrl}/order-cancelled/${order?._id}`;
    return await this.stripeService.stripe.checkout.sessions.create({
      line_items: [{ price: order.priceId, quantity: order.quantity }],
      cancel_url: cancelUrl,
      success_url: successUrl,
      mode: 'payment',
    });
  }

  async getOrderById(data: GetOrderDto) {
    return this.orderModel.findOne({ _id: data.orderId });
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
      order.paymentUrl = checkoutSession.url;
      await order.save();

      return order;
    } catch (error) {
      console.log(error);
      throw ApiError.error(Messages.CREATE_ORDER_FAILED);
    }
  }

  async processOrderHook(request: any) {
    try {
      const sig = request.headers['stripe-signature'];
      const event = await this.stripeService.constructEvent(
        request.rawBody,
        sig,
      );

      switch (request.body?.type) {
        case PaymentEvents.CHECKOUT_COMPLETE:
          await this.checkoutCompleteEventHandler(event.data.object);
          break;
        case PaymentEvents.PAYMENT_INTENT_SUCCESS:
          await this.paymentIntentSuccessEventHandler(event.data.object);
          break;
        default:
      }
    } catch (err) {
      throw ApiError.error(Messages.PROCESS_STRIPE_EVENT_FAILED);
    }

    return true;
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
    const paymentIntentId = object?.id;
    const order = await this.orderModel.findOne({
      paymentIntentId,
    });

    if (order) {
      order.paymentIntent = object;
      await order.save();
    }
  }
}

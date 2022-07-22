import { ConfigService } from '../common/services/config.service';
import { OrderStatus } from '../database/schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from '../common/services/stripe.service';
import { Order, OrderDocument } from '../database/schemas/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Book, BookDocument } from '../database/schemas/book.schema';
import { PaymentEvents } from '../common/constants/constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async getPaymentLink(orderId: string) {
    try {
      const order = await this.orderModel.findOne({ _id: orderId });
      if (order) {
        const successUrl = `${this.configService.app.feUrl}/order-created`;
        const paymentLink = await this.stripeService.createPaymentLink(
          {
            quantity: order.quantity,
            priceId: order.priceId,
          },
          successUrl,
        );
        console.log('@== paymentLink', paymentLink);
        return paymentLink;
      }
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
        status: OrderStatus.DONE,
        quantity: 1,
      });
      await order.save();
      return await this.getPaymentLink(order._id);
    } catch (error) {
      return {
        status: 'failed',
        data: null,
      };
    }
  }

  async processOrderHook(request: any) {
    let event;
    try {
      switch (request.body?.type) {
        case PaymentEvents.PAYMENT_INTENT_SUCCESS:
          const sig = request.headers['stripe-signature'];
          console.log('@== processOrderHook sig', sig);
          console.log('@== processOrderHook', request.body);
          event = await this.stripeService.constructEvent(request.rawBody, sig);
          break;
        default:
          console.log('Hooks: Unhandled: ', request.body);
      }
    } catch (err) {
      console.log('@== processOrderHook err ', err);
    }

    return event;
  }
}

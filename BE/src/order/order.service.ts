import { ConfigService } from './../common/services/config.service';
import { OrderStatus } from './../database/schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from '../common/services/stripe.service';
import { Order, OrderDocument } from '../database/schemas/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Book, BookDocument } from '../database/schemas/book.schema';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  async getPaymentLink(orderId: string) {
    const order = await this.orderModel.findOne({ _id: orderId });
    if (order) {
      return await this.stripeService.createPaymentLink(
        {
          quantity: order.quantity,
          priceId: order.priceId,
        },
        `${this.configService.app.feUrl}/order-created`,
      );
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
}

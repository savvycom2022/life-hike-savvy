import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

@Schema()
export class Order {
  @Prop()
  username: string;

  @Prop()
  phone: string;

  @Prop()
  productId: string;

  @Prop()
  priceId: string;

  @Prop()
  quantity: number;

  @Prop()
  status: OrderStatus;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

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
  paymentIntentId: string;

  @Prop({ type: SchemaType.Types.Mixed })
  paymentInfo: SchemaType.Types.Mixed;

  @Prop({ type: SchemaType.Types.Mixed })
  paymentIntent: SchemaType.Types.Mixed;

  @Prop()
  paymentUrl: string;

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

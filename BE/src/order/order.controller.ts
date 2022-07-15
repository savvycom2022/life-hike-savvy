import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateLinkDto } from './dtos/create-link.dto';
import { ApiResult } from '../common/classes/api-result';
import { CreateOrderDto } from './dtos/create-order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('payment/link')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPaymentLink(@Query() query: CreateLinkDto) {
    const response = await this.orderService.getPaymentLink(query.orderId);
    return new ApiResult().success(response);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() data: CreateOrderDto) {
    const response = await this.orderService.createOrder(data);
    return new ApiResult().success(response);
  }
}

import {
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { ApiResult } from '../common/classes/api-result';
import { CreateOrderDto } from './dtos/create-order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() data: CreateOrderDto) {
    const response = await this.orderService.createOrder(data);
    return new ApiResult().success(response);
  }

  @Post('payment/hook')
  @UsePipes(new ValidationPipe({ transform: true }))
  async paymentHook(@Req() req: RawBodyRequest<Request>) {
    await this.orderService.processOrderHook(req);
    return new ApiResult().success();
  }
}

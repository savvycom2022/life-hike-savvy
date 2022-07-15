import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  orderId: string;
}

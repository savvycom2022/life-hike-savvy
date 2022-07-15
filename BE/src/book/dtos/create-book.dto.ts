import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsNumber()
  @IsOptional()
  price: number;
}

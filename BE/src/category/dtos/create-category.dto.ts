import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  name: string;
}

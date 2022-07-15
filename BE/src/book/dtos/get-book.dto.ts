import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetBookDto {
  @ApiProperty({ required: false, type: 'string' })
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty({ required: false, type: 'number', default: 10 })
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false, type: 'number', default: 0 })
  @IsOptional()
  offset: number;
}

export class GetBookByIdDto {
  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  id: string;
}

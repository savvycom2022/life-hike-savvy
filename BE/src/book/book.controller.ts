import {
  Body,
  Controller,
  Post,
  UsePipes,
  Request,
  ValidationPipe,
  Get, Query, Param,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '../common/classes/api-result';
import { CreateBookDto } from './dtos/create-book.dto';
import { Book } from '../database/schemas/book.schema';
import { GetBookByIdDto, GetBookDto } from './dtos/get-book.dto';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: Book })
  async create(@Request() request, @Body() data: CreateBookDto) {
    const response = await this.bookService.createBook(data);
    return new ApiResult().success(response);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: Book })
  async getBooks(@Query() query: GetBookDto) {
    const response = await this.bookService.getBooks(query);
    return new ApiResult().success(response);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: Book })
  async getBookById(@Param() param: GetBookByIdDto) {
    const response = await this.bookService.getBookById(param);
    return new ApiResult().success(response);
  }
}

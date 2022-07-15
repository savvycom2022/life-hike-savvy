import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dtos/create-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../database/schemas/category.schema';
import { Book, BookDocument } from '../database/schemas/book.schema';
import { GetBookByIdDto, GetBookDto } from './dtos/get-book.dto';
import { StripeService } from '../common/services/stripe.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private stripeService: StripeService,
  ) {}

  async createBook(data: CreateBookDto): Promise<Book> {
    const book = new this.bookModel(data);
    const product = await this.stripeService.createProduct(book.name);
    const price = await this.stripeService.createPrice({
      unitAmount: book.price || 0,
      productId: product.id || '',
    });
    book.productId = product.id;
    book.priceId = price.id;
    return await book.save();
  }

  async getBooks(query: GetBookDto) {
    const whereCondition = {};
    if (query.text) {
      whereCondition['name'] = { $regex: '.*' + query.text + '.*' };
    }

    const [books, total] = await Promise.all([
      this.bookModel
        .find(whereCondition)
        .limit(query.limit)
        .skip(query.offset)
        .sort({ name: 1 }),
      this.bookModel.find(whereCondition).count(),
    ]);

    const categoryIds = books.map((book) => book.categoryId);
    const categories = await this.categoryModel.find({
      where: {
        _id: { $in: categoryIds },
      },
    });

    const items = books.map((book) => ({
      ...book.toJSON(),
      category: categories.find((_) => _._id.toString() === book.categoryId),
    }));

    return { items, total };
  }

  async getBookById(query: GetBookByIdDto) {
    const book = await this.bookModel.findOne({ _id: query.id });
    if (!book) {
      return null;
    }

    const category = await this.categoryModel.findOne({ _id: book.categoryId });
    return {
      ...book.toJSON(),
      category: category ? category.toJSON() : null,
    };
  }
}

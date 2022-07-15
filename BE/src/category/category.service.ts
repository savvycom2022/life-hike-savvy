import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../database/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(data);
    return await category.save();
  }

  async getCategories() {
    const [categories, count] = await Promise.all([
      this.categoryModel.find(),
      this.categoryModel.count(),
    ]);
    return { items: categories, total: count };
  }
}

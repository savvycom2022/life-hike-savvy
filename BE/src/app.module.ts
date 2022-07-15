import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    BookModule,
    CategoryModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '../common/services/config.service';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.db.url,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}

import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { HttpExceptionFilter } from './exceptions.filter';
import { ConfigService } from './services/config.service';
import { StripeService } from './services/stripe.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env`),
    },
    {
      provide: StripeService,
      useFactory: (configService: ConfigService) => {
        return new StripeService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [ConfigService, StripeService],
})
export class CommonModule {}

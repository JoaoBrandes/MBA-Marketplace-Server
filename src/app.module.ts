import { envSchema } from 'env/env';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FindProductController } from './products/findProduct.controller';
import { HandleProductController } from './products/handle-product.controller';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AccountModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [HandleProductController, FindProductController],
})
export class AppModule {}

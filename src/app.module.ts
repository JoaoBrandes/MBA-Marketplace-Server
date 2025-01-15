import { envSchema } from 'env/env';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CreateAccountController } from './account/account.controller';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './auth/authenticate-controller';
import { PrismaModule } from './prisma/prisma.module';
import { FindProductController } from './products/findProduct.controller';
import { HandleProductController } from './products/handle-product.controller';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController, AuthenticateController, HandleProductController, FindProductController],
})
export class AppModule {}

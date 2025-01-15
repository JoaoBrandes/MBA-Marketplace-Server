import { CreateAccountController } from 'src/account/account.controller';
import { AuthenticateController } from 'src/auth/authenticate-controller';
import { FindProductController } from 'src/products/findProduct.controller';
import { HandleProductController } from 'src/products/handle-product.controller';

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [CreateAccountController, AuthenticateController, HandleProductController, FindProductController],
})
export class ControllerModule {}

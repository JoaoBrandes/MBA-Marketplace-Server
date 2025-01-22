import { AuthModule } from 'src/auth/auth.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PrismaService } from 'src/prisma/prisma.service'

import { Module } from '@nestjs/common'

import { CreateAccountController } from './create/createAccount.controller'
import { EditAccountController } from './edit/editAccount.controller'
import { FetchAccountController } from './fetch/fetchAccount.controller'

@Module({
  imports: [AuthModule],
  providers: [PrismaService],
  controllers: [CreateAccountController, EditAccountController, FetchAccountController],
})
export class AccountModule {}

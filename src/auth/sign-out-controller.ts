import { PrismaService } from 'src/prisma/prisma.service'

import { Controller, Post, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { CurrentUser } from './current-user-decorator'
import { UserPayload } from './jwt.strategy'
import { Public } from './public'

@Controller('/sign-out')
@Public()
export class SignOutController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes()
  async handle(@CurrentUser() currentUser: UserPayload) {
    const userId = currentUser.sub

    return userId
  }
}

import { CurrentUser } from 'src/auth/current-user-decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller('/sellers/me')
export class FetchAccountController {
  constructor(private prisma: PrismaService) {}
  @Get()
  @HttpCode(201)
  async handle(@CurrentUser() currentUser: UserPayload) {
    const userId = currentUser.sub

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    })

    return existingUser
  }
}

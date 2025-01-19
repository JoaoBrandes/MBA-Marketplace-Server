import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { Public } from 'src/auth/public'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/validation/pipes/zod-validation-pipe'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  phone: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/sellers')
@Public()
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password, passwordConfirmation, phone } = body

    const emailAlreadyExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (emailAlreadyExist) {
      throw new ConflictException('User already exists')
    }

    const phoneAlreadyExist = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (phoneAlreadyExist) {
      throw new ConflictException('User already exists')
    }

    if (password.localeCompare(passwordConfirmation) !== 0) {
      throw new ConflictException('Confirmation does not match with password')
    }

    const hashedPassword = await hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    })

    return user
  }
}

import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common'
import { hash, decodeBase64, compare } from 'bcryptjs'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { Public } from 'src/auth/public'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/validation/pipes/zod-validation-pipe'
import { z } from 'zod'

const editAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
})

const validationPipe = new ZodValidationPipe(editAccountBodySchema)
type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>

@Controller('/sellers')
export class EditAccountController {
  constructor(private prisma: PrismaService) {}
  @Put()
  @HttpCode(201)
  async handle(@Body(validationPipe) body: EditAccountBodySchema, @CurrentUser() user: UserPayload) {
    const { email, name, password, newPassword, phone } = body
    const userId = user.sub

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (email !== existingUser.email) {
      const emailAlreadyExist = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
  
      if (emailAlreadyExist) {
        throw new ConflictException('Email already exists')
      }
    }

    if (phone !== existingUser.phone) {
      const phoneAlreadyExist = await this.prisma.user.findUnique({
        where: {
          phone,
        },
      })
  
      if (phoneAlreadyExist) {
        throw new ConflictException('Phone already exists')
      }
    }
    
    const isPasswordValid = await compare(password, existingUser.password)
    if (!isPasswordValid) {
      throw new ConflictException('Confirmation does not match with password')
    }

    const hashedPassword = await hash(newPassword, 10)

    const newUser = await this.prisma.user.update({
      data:  {
        email,
        name,
        password: hashedPassword,
        phone,
      },
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

    return newUser
  }
}

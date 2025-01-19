import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/validation/pipes/zod-validation-pipe'
import { z } from 'zod'

import { ProductStatus } from '@prisma/client'

const productBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  categoryId: z.number(),
})
const bodyValidationPipe = new ZodValidationPipe(productBodySchema)

type ProductBodySchema = z.infer<typeof productBodySchema>

@Controller('/products')
export class HandleProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createProduct(
    @Body(bodyValidationPipe) body: ProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const { categoryId, description, priceInCents, title } = body

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!existingUser) {
      throw new ConflictException('User does not exists')
    }

    try {
      await this.prisma.product.create({
        data: {
          description,
          priceInCents,
          title,
          categoryId,
          status: 'AVAILABLE',
          userId,
        },
      })
    } catch (err) {
      return 'Error Creating product '
    }

    return 'Product Created'
  }

  @Put('/:productId')
  async editProduct(
    @Body(bodyValidationPipe) body: ProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('productId') productId: string,
  ) {
    await this.checkValidURLCall(productId, user)
    const { categoryId, description, priceInCents, title } = body

    const response = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        title,
        priceInCents,
        description,
        categoryId,
      },
    })

    return { response }
  }

  @Put('/:productId/:status')
  async updateProductStatus(
    @Body(bodyValidationPipe) body: ProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('productId') productId: string,
    @Param('status') status: ProductStatus,
  ) {}

  async checkValidURLCall(productId: string, user: UserPayload) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      throw new ConflictException('Product does not exists')
    }

    if (product.userId !== user.sub) {
      throw new ForbiddenException('You are not the owner of this product')
    }
  }
}

import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/validation/pipes/zod-validation-pipe'
import { z } from 'zod'

import {
  ConflictException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const validationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/products')
export class FindProductController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async findAll(@Query('page', validationPipe) page: PageQueryParamSchema) {
    const itemsPerPage = 20

    const products = await this.prisma.product.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: true,
        category: true,
      },
    })
    return { products }
  }

  @Get('/:productId')
  async findById(@Param('productId') productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      throw new ConflictException('Product does not exists')
    }

    return { product }
  }
}

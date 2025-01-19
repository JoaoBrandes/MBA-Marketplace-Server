import { AppModule } from 'src/app.module'
import request from 'supertest'

import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

describe.skip('Create Account', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('Should be able to create a valid product', async () => {
    const response = await request(app.getHttpServer()).post('/products').send({
      title: 'Armário',
      description: 'Armário teste',
      priceInCents: 1900,
      categoryId: 1,
    })
    expect(response.statusCode).toBe(201)
  })

 
})

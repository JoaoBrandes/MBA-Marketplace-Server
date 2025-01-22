import { AppModule } from 'src/app.module'
import request from 'supertest'

import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

describe('Create Account', () => {
  let app: INestApplication

  const john = {
    name: 'John Doe',
    email: 'john_doe@mail.com.br',
    password: '123456',
    passwordConfirmation: '123456',
    phone: '1998765-5555',
  }

  

  const jane = {
    name: 'Jane Doe',
    email: 'jane_doe@mail.com.br',
    password: '123456',
    passwordConfirmation: '123456',
    phone: '1998765-5555',
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('Should be able to create a valid seller', async () => {
    const response = await request(app.getHttpServer())
      .post('/sellers')
      .send(john)

    expect(response.statusCode).toBe(201)
  })

  it('Should Not be able to create a Seller with duplicated e-mail', async () => {
    const response = await request(app.getHttpServer())
      .post('/sellers')
      .send(john)
    expect(response.statusCode).toBe(409)
  })

  it('Should Not be able to create a Seller with duplicated phone number', async () => {
    const response = await request(app.getHttpServer())
      .post('/sellers')
      .send(jane)
    expect(response.statusCode).toBe(409)
  })
})

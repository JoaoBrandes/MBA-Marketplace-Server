import { hash } from 'bcryptjs'
import {  randomUUID } from 'node:crypto'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import request from 'supertest'

import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

describe('Create Account', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let originalUser: { id: string }
  let accessToken: string

  const editedUser = {
    name: 'Edited User',
    email: 'edited@mail.com.br',
    password: '33123',
    newPassword: '14568',
    phone: '197415-6321',
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
    originalUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'Original User',
        email: 'orig@mail.com.br',
        password: await hash('33123', 10),
        phone: '197415-6321',
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        phone: true
      },
    })

    accessToken = jwt.sign({ sub: originalUser.id.toString() })
  })

  it('Should be able to edit a valid user', async () => {
    const responseEdit = await request(app.getHttpServer())
      .put('/sellers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(editedUser)
    expect(responseEdit.statusCode).toBe(201)
  })

  it.only('Should not be able to edit a user with the wrong password', async () => {
    const testUser = {
      ...originalUser,
      password: 'wrong'
    }

    const responseEdit = await request(app.getHttpServer())
      .put('/sellers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testUser)

    expect(responseEdit.statusCode).toBe(409)
  })

})

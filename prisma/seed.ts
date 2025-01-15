import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const hashedPassword = await hash("password", 10)
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "João Teste",
      email: "joaoTeste@mail.com",
      phone: "1234-5678",
      password: hashedPassword
    }
  })

   const movel = await prisma.category.upsert({
    where: { title: "Móvel" },
    create: {
      title: "Móvel",
      slug: "Móveis para casa",
    },
    update: {
      title: "Móvel",
      slug: "Móveis para casa",
    }
  })
  
  await prisma.category.upsert({
    where: { title: "Vestuário" },
    create: {
      title: "Vestuário",
      slug: "Vestuário",
    },
    update: {
      title: "Vestuário",
      slug: "Vestuário",
    }
  })
  
  await prisma.category.upsert({
    where: { title: "Brinquedos" },
    create: {
      title: "Brinquedos",
      slug: "Brinquedos",
    },
    update: {
      title: "Brinquedos",
      slug: "Brinquedos",
    }
  })

  await prisma.category.upsert({
    where: { title: "Papelaria" },
    create: {
      title: "Papelaria",
      slug: "Papelaria",
    },
    update: {
      title: "Papelaria",
      slug: "Papelaria",
    }
  })

 await prisma.category.upsert({
    where: { title: "Saude e beleza" },
    create: {
      title: "Saude e beleza",
      slug: "Saude e beleza",
    },
    update: {
      title: "Saude e beleza",
      slug: "Saude e beleza",
    }
  })

 await prisma.category.upsert({
    where: { title: "Utensílio" },
    create: {
      title: "Utensílio",
      slug: "Utensílio",
    },
    update: {
      title: "Utensílio",
      slug: "Utensílio",
    }
  })

  await prisma.product.create({
    data: {
      title: "Armário",
      description: "Armário de madeira",
      priceInCents: 20000,
      categoryId: movel.id,
      userId: user.id
    }
  })
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
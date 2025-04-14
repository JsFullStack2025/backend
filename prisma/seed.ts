import { PrismaClient } from '@prisma/client'
import { create } from 'domain'
const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.users.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      first_name: 'Alice',
      username: 'alice',
      password: '$argon2id$v=19$m=65536,t=3,p=4$D2giyw8P9397nYpPYxJm2g$ft/F0KEZ8u+EgOWyCyHoI5LE41yDxzso7eI3tNvFLPI',
      Cards: {
        create: [
            {
              cardData: '{"firstname": "Alice", "email": "alice@prisma.io"}',
              shared: true,
              designPrototype: {
                create: {
                  title: "Шаблон 1",
                  description: "Описание шаблона 1",
                  designData: '{"bgImgUrl": "image1.jpg", "designData":""}'
                }
              }
            },
            {
              cardData: '{"firstname": "Alice", "email": "alice@prisma.io"}',
              shared: true,
              designPrototype: {
                create: {
                  title: "Шаблон 2",
                  description: "Описание шаблона 2",
                  designData: '{"bgImgUrl": "image2.jpg", "designData":""}'
                }
              }
            },
          ],
        }
    },
  })
  const design3 = await prisma.cardTypes.upsert({
    where: { id: 3, title: 'Шаблон 3'},
    update:{},
    create: {
      title: "Шаблон 3",
      description: "Описание шаблона 3",
      designData: '{"bgImgUrl": "image3.jpg", "designData":""}'
    }
  });
  const design4 = await prisma.cardTypes.upsert({
    where: { id: 4, title: 'Шаблон 4'},
    update:{},
    create: {
      title: "Шаблон 4",
      description: "Описание шаблона 4",
      designData: '{"bgImgUrl": "image4.jpg", "designData":""}'
    }
  });
  const design5 = await prisma.cardTypes.upsert({
    where: { id: 5, title: 'Пользовательский шаблон'},
    update:{},
    create: {
      title: "Пользовательский шаблон",
      description: "Описание шаблона 5",
      designData: '{"bgImgUrl": "image0.jpg", "designData":""}'
    }
  });

  const bob = await prisma.users.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      first_name: 'Bob',
      username: 'bob',
      password: '$argon2id$v=19$m=65536,t=3,p=4$D2giyw8P9397nYpPYxJm2g$ft/F0KEZ8u+EgOWyCyHoI5LE41yDxzso7eI3tNvFLPI',
      isAdmin: true
    },
  });
  console.log({ alice, bob })
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
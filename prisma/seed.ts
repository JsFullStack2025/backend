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
            },
            {
              cardData: '{"firstname": "Alice", "email": "alice@prisma.io"}',
              shared: true,
            },
          ],
        }
    },
  })
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
  })
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
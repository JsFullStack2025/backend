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
      login: 'alice',
      hash: '12345',
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
      login: 'bob',
      hash: '12345'
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
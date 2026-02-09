import { eq } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'
import { db } from './index'
import { user } from './schema'

const FIRST_NAME = 'Emigdio'
const LAST_NAME = 'Torres'
const NAME = `${FIRST_NAME} ${LAST_NAME}`
const EMAIL = 'emigdio@tahei.com'
const PASSWORD = 'tahei123'

async function seed() {
  console.log('Seeding database...')
  console.log('Creating user...')

  const existingAdmin = await db.select().from(user).where(eq(user.email, EMAIL)).limit(1)

  if (existingAdmin.length > 0) {
    console.log('User is already present, skipping creation.')
    return
  }

  const signUpResult = await authServer.api.signUpEmail({
    body: {
      email: EMAIL,
      password: PASSWORD,
      name: NAME,
    },
  })

  if (!signUpResult.user) {
    throw new Error('Failed to create user')
  }

  console.log('Database seeded successfully!')
  console.log('\nCredentials:')
  console.log(`Email: ${EMAIL}`)
  console.log(`Password: ${PASSWORD}`)
  console.log('\nAdvice: change the password after first login')
}

seed()
  .catch((error) => {
    console.error('Error seeding database:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

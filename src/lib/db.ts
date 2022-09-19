import { dev } from '$app/environment'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

export const db = new PrismaClient({ log: dev ? ['info', 'query', 'warn', 'error'] : [] })

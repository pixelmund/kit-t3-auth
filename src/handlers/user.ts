import { z } from 'zod'
import { db } from '../lib/db'
import { createRouter } from '../lib/trpc.server'

export const users = createRouter()
	.query('browse', {
		resolve: () => db.user.findMany({ orderBy: { createdAt: 'desc' } }),
	})
	.query('details', {
		input: z.object({ id: z.number().int() }),
		resolve: ({ input }) => db.user.findFirst({ where: { id: input.id } }),
	})

import { createRouter } from '$lib/trpc.server'
import trpcTransformer from 'trpc-transformer'
import { auth } from './auth'
import { users } from './user'

export const router = createRouter()
	.transformer(trpcTransformer)
	.merge('user:', users)
	.merge('auth:', auth)

export type Router = typeof router

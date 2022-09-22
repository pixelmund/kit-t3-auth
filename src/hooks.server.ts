import { db } from '$lib/db'
import { createContext, responseMeta } from '$lib/trpc.server'
import { createTRPCHandle } from 'trpc-sveltekit'
import type { Handle } from '@sveltejs/kit'
import { verifyJWT } from '$lib/jwt'
import { router } from './handlers'

export async function getUser(userId?: number) {
	if (!userId) return null
	return db.user.findUnique({ where: { id: userId }, select: { id: true } })
}

export const handle: Handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('uid')

	if (typeof authCookie === 'string') {
		const jwtUser = await verifyJWT<App.Locals['user']>(authCookie)
		event.locals.user = await getUser(jwtUser?.id)
	}

	const response = await createTRPCHandle({
		url: '/trpc',
		router,
		createContext, // optional
		responseMeta, // optional
		event,
		resolve,
	})

	return response
}

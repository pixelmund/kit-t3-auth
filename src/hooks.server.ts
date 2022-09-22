import { db } from '$lib/db'
import { createContext, responseMeta } from '$lib/trpc.server'
import { createTRPCHandle } from 'trpc-sveltekit'
import { router } from './handlers'
import { handleSession } from 'svelte-kit-cookie-session'
import { JWT_SECRET } from '$env/static/private'

export async function getUser(userId?: number) {
	if (!userId) return null
	return db.user.findUnique({ where: { id: userId }, select: { id: true } })
}

export const handle = handleSession({ secret: JWT_SECRET }, async ({ event, resolve }) => {
	const user = await getUser(event.locals.session.data?.userId)
	event.locals.user = user

	const response = await createTRPCHandle({
		url: '/trpc',
		router,
		createContext, // optional
		responseMeta, // optional
		event,
		resolve,
	})

	// Cookies set via cookies.set, etc are not getting applied to the response, thats why we need to hack this a little bit:
	if (event.url.pathname.startsWith('/trpc/auth')) {
		try {
			const setCookie = (await resolve(event)).headers.get('set-cookie')
			if (setCookie) {
				response.headers.append('set-cookie', setCookie)
			}
		} catch (error) {
			// do nothing
		}
	}

	return response
})

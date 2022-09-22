import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'

// optional
export const createContext = (event: RequestEvent) => {
	return {
		event,
		session: event.locals.session,
		user: event.locals.user,
	}
}

// optional
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseMeta = () => {
	return {}
}

export const createRouter = () => {
	return trpc.router<inferAsyncReturnType<typeof createContext>>()
}

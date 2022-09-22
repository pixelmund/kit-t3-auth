import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'

// optional
export const createContext = (event: RequestEvent) => {
	let jwtCookie: string | undefined

	return {
		event,
		jwtCookie,
	}
}

// optional
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseMeta = (params: any) => {
	const context = params.ctx as inferAsyncReturnType<typeof createContext>

	if (context.jwtCookie) {
		return {
			headers: {
				'Set-Cookie': context.jwtCookie,
			},
		}
	}

	return {}
}

export const createRouter = () => {
	return trpc.router<inferAsyncReturnType<typeof createContext>>()
}

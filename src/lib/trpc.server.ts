import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'
import { signJWT } from './jwt'

// optional
export const createContext = (event: RequestEvent) => {
	const session = {
		cookie: '',
		async create(userId: number) {
			session.cookie = event.cookies.serialize('uid', await signJWT({ id: userId }), {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60,
			})
		},
		async destroy() {
			session.cookie = event.cookies.serialize('uid', '0', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
			})
		},
	}

	return {
		event,
		session,
	}
}

// optional
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseMeta = (params: any) => {
	const context = params.ctx as inferAsyncReturnType<typeof createContext>

	if (context.session.cookie.length > 0) {
		return {
			headers: {
				'Set-Cookie': context.session.cookie,
			},
		}
	}

	return {}
}

export const createRouter = () => {
	return trpc.router<inferAsyncReturnType<typeof createContext>>()
}

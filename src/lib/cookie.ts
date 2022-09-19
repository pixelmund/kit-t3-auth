import { serialize } from 'cookie'

export function createCookie(key: string, value: string, maxAge: number) {
	return serialize(key, value, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge,
	})
}

export function destroyCookie(key: string) {
	return serialize(key, '0', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		expires: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
	})
}

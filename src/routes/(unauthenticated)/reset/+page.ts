import trpc from '$lib/trpc'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url, fetch }) => {
	const code = url.searchParams.get('code')

	if (!code) {
		throw error(404, 'Not found.')
	}

	const isTokenVerified = await trpc(fetch).query('auth:verifyResetToken', { code })

	if (!isTokenVerified.ok) {
		throw error(400, "Token is either expired or doesn't exist.")
	}

	return {}
}

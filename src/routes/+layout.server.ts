import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		isLoggedIn: !!locals.user,
		userId: locals.user?.id,
	}
}

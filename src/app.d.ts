// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	type GetUser = typeof import('./hooks.server').getUser

	interface Locals {
		user: import('@trpc/server').inferAsyncReturnType<GetUser>
		session: import('svelte-kit-cookie-session').Session<{ userId?: number }>
	}
	interface PageData {
		userId?: number | null
		isLoggedIn: boolean
	}
	// interface Platform {}
}

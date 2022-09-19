<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$lib/ui/Button.svelte'
	import trpc from '$lib/trpc'

	async function logout() {
		await trpc().mutation('auth:logout')
		await invalidateAll()
	}
</script>

<div class="pt-12">
	<div
		class="mx-auto flex w-full max-w-3xl flex-col items-center bg-white px-8 py-10 text-center shadow sm:rounded-lg">
		<img
			src="https://user-images.githubusercontent.com/43737355/189502485-be99e3ce-272b-49a9-abe8-5496238dfbb3.png"
			alt="T3-SvelteKit" />
		{#if $page.data.isLoggedIn}
			<h1 class="mt-8 text-4xl font-bold text-indigo-600">Welcome back!</h1>
			<div class="mt-12 grid w-full grid-cols-2 gap-4">
				<a class="flex items-center w-full rounded-md bg-gray-200 py-2 text-center justify-center text-sm" href="/dashboard">Dashboard</a>
				<Button on:click={logout}>Sign out</Button>
			</div>
		{:else}
			<div class="mt-12 grid w-full grid-cols-2 gap-4">
				<a class="flex items-center w-full rounded-md bg-gray-200 py-2 text-center justify-center text-sm" href="/login">Login</a>
				<a class="flex items-center w-full rounded-md bg-indigo-600 text-white py-2 text-center justify-center text-sm" href="/register"
					>Register</a>
			</div>
		{/if}
	</div>
</div>

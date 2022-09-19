<script lang="ts">
	import { z } from 'zod'
	import { invalidateAll } from '$app/navigation'
	import trpc from '$lib/trpc'
	import Field from '$lib/ui/forms/Field.svelte'
	import { createForm } from '$lib/ui/forms'
	import SubmitButton from '$lib/ui/forms/SubmitButton.svelte'

	const LoginSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6, { message: 'Password should be at leat 6 characters' }),
	})

	const { form, isSubmitting } = createForm({
		schema: LoginSchema,
		onSubmit: async ({ email, password }) => {
			await trpc().mutation('auth:login', { email, password })
			await invalidateAll()
		},
	})
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<img
			class="mx-auto h-12 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
			alt="Your Company" />
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
			Sign in to your account
		</h2>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" use:form method="POST">
				<Field name="email" label="E-Mail" type="email" />
				<Field name="password" label="Password" type="password" />
				<div class="flex items-center justify-end">
					<div class="text-sm">
						<a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500"
							>Forgot your password?</a>
					</div>
				</div>
				<div>
					<SubmitButton {isSubmitting} class="w-full">Sign in</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</div>

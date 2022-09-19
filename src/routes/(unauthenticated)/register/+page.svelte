<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { createForm } from '$lib/ui/forms'
	import Field from '$lib/ui/forms/Field.svelte'
	import SubmitButton from '$lib/ui/forms/SubmitButton.svelte'
	import trpc from '$lib/trpc'
	import { z } from 'zod'

	const RegisterSchema = z.object({
		name: z.string().optional(),
		email: z.string().email(),
		password: z.string().min(6, { message: 'Password should be at least 6 characters' }),
	})

	const { form, isSubmitting } = createForm({
		schema: RegisterSchema,
		onSubmit: async ({ name, email, password }) => {
			await trpc().mutation('auth:register', { name, email, password })
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
			Create a new account
		</h2>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form use:form class="space-y-6" method="POST">
				<Field name="name" label="Name" />
				<Field name="email" label="E-Mail" type="email" />
				<Field name="password" label="Password" type="password" />

				<div class="flex items-center justify-end">
					<div class="text-sm">
						<a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500"
							>Forgot your password?</a>
					</div>
				</div>

				<div>
					<SubmitButton {isSubmitting} class="w-full">Sign up</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</div>

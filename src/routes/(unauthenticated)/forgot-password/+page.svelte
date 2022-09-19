<script lang="ts">
	import { z } from 'zod'
	import { toast } from '@zerodevx/svelte-toast'
	import trpc from '$lib/trpc'
	import Field from '$lib/ui/forms/Field.svelte'
	import { createForm } from '$lib/ui/forms'
	import SubmitButton from '$lib/ui/forms/SubmitButton.svelte'

	const ForgotPasswordSchema = z.object({
		email: z.string().email(),
	})

	const { form, isSubmitting } = createForm({
		schema: ForgotPasswordSchema,
		onSubmit: async ({ email }) => {
			await trpc().mutation('auth:forgotPassword', { email })
			// TODO: Real email notification
			toast.push('Check your emails for a reset link.', {
				theme: {
					'--toastBackground': '#48BB78',
					'--toastBarBackground': '#2F855A',
				},
			})
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
			Forgot your password?
		</h2>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" use:form method="POST">
				<Field name="email" label="E-Mail" type="email" />
				<div>
					<SubmitButton {isSubmitting} class="w-full">Forgot password</SubmitButton>
				</div>
			</form>
		</div>
	</div>
</div>

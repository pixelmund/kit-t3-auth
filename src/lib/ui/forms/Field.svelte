<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte'

	export let name: string
	export let label: string
	export let type: HTMLInputElement['type'] = 'text'
	export let autocomplete: HTMLInputElement['autocomplete'] | undefined = undefined
</script>

<div>
	<label for={name} class="block text-sm font-medium text-gray-700">
		{label}
	</label>
	<ValidationMessage for={name} let:messages>
		<svelte:fragment>
			<div class="mt-1">
				<input
					id={name}
					{name}
					{type}
					{autocomplete}
					{...$$restProps}
					class="block w-full appearance-none rounded-md border {messages ? 'border-red-300' : 'border-gray-300'} px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
			</div>
			<span class="d-block mt-4 text-xs text-red-500">{messages || ''}</span>
		</svelte:fragment>
	</ValidationMessage>
</div>

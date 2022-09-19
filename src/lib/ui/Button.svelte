<script lang="ts">
	export let type: 'submit' | 'button' | 'reset' = 'button'

	let klass: string = ''
	export { klass as class }
</script>

<button
	on:click
	{...$$restProps}
	{type}
	class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 {klass}">
	<slot />
</button>

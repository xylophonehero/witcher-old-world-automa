<script lang="ts">
	export let onClick: (() => void) | null = null;
	export let hoverable: boolean = false;
</script>

<div class="grid ring ring-secondary rounded-xl text-secondary ring-offset-2 ring-offset-base-100">
	<button
		class="grid place-items-center overflow-hidden transition-transform rounded-xl data-[hoverable='true']:hover:scale-105"
		data-hoverable={hoverable}
		data-has-click={onClick !== null}
		on:click={onClick}
	>
		<slot />
	</button>
</div>

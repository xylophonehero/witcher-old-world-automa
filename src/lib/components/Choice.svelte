<script lang="ts">
	type Item = {
		id: any;
		name: any;
	};

	export let title = '';
	export let onClick: (itemId: any) => void;
	export let items: Readonly<Item[]> = [];
</script>

<section class="flex flex-col justify-center flex-1 gap-4 text-center">
	<h2 class="text-2xl">
		{title}
	</h2>

	<div class="flex flex-wrap justify-center gap-2">
		{#each items as item}
			<button class="btn btn-primary" on:click={() => onClick(item.id)}>
				{item.name}
			</button>
		{/each}
	</div>
</section>

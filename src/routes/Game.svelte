<script>
	import Icon from '@iconify/svelte';
	import { difficulties, gameService, witchers } from '$lib/machines/gameService';
	import Choice from '$lib/components/Choice.svelte';
	import CardZone from '$lib/components/CardZone.svelte';
	import Deck from '$lib/components/Deck.svelte';
</script>

{#if $gameService.matches('Setting up.Pick difficulty')}
	<Choice
		title="Pick difficulty"
		items={difficulties}
		onClick={(itemId) => gameService.send({ type: 'pick difficulty', difficulty: itemId })}
	/>
{/if}

{#if $gameService.matches('Setting up.Choose witcher')}
	<Choice
		title="Choose witcher"
		items={witchers}
		onClick={(itemId) => gameService.send({ type: 'choose witcher', witcher: itemId })}
	/>
{/if}

{#if $gameService.matches('Playing')}
	<Deck deck="action" />
	<Deck deck="challenge" />

	<h3>Trophies remaining: {$gameService.context.automaCards.length}</h3>
	<button class="btn btn-primary" on:click={() => gameService.send({ type: 'Collect trophy' })}
		>Collect trophy</button
	>

	<!-- <CardZone onClick={() => gameService.send({ type: 'Collect trophy' })}>
		{#if $gameService.context.automaCards.length > 0}
			<img src="/assets/cards/back.png" alt="Action deck" />
		{:else}
			<Icon class="w-1/5 h-1/5" icon="iconamoon:restart-bold" />
		{/if}
	</CardZone> -->
{/if}

{#if $gameService.matches('end')}
	<h2>Game over</h2>
	<p>Automa won!</p>
	<button class="btn btn-primary" on:click={() => gameService.send({ type: 'Reset' })}>Reset</button
	>
{/if}

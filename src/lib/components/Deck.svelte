<script lang="ts">
	import { gameService, type DeckType } from '$lib/machines/gameService';
	import Icon from '@iconify/svelte';
	import CardZone from './CardZone.svelte';

	export let deck: DeckType;
	$: deckName = deck === 'action' ? 'actionDeck' : ('challengeDeck' as `${DeckType}Deck`);
	$: discardName =
		deck === 'action' ? 'actionDiscard' : ('challengeDiscard' as `${DeckType}Discard`);
</script>

<h2>{deck} deck</h2>
<div class="grid grid-cols-2 gap-4">
	{#if $gameService.context[deckName].length > 0}
		<CardZone hoverable onClick={() => gameService.send({ type: 'Draw card', deck })}>
			<img src="/assets/cards/back.png" alt="Action deck" />
		</CardZone>
	{:else}
		<CardZone onClick={() => gameService.send({ type: 'Reset deck', deck })}>
			<Icon class="w-1/5 h-1/5" icon="iconamoon:restart-bold" />
		</CardZone>
	{/if}
	<CardZone>
		{#if $gameService.context[discardName].length > 0}
			<img src={$gameService.context[discardName].at(-1).image} alt="Action discard" />
		{/if}
	</CardZone>
</div>

{#if deck === 'challenge'}
	<button class="btn btn-primary" on:click={() => gameService.send({ type: 'Reset deck', deck })}>
		Reset deck
	</button>
{/if}

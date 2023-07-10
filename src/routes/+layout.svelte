<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { webVitals } from '$lib/vitals';
	import Header from './Header.svelte';
	import './styles.css';

	/** @type {import('./$types').LayoutServerData} */
	export let data;

	$: if (browser && data?.analyticsId) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId: data.analyticsId
		});
	}
</script>

<div
	class="grid grid-cols-[minmax(16px,_1fr)_minmax(0%,_800px)_minmax(16px,_1fr)] grid-rows-[auto_1fr_auto] gap-y-8 [&>*]:col-start-2 h-full max-h-screen"
>
	<Header />

	<main class="flex flex-col gap-4">
		<slot />
	</main>
</div>

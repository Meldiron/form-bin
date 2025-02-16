<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data, children } = $props();
</script>

<nav
	class="mx-auto mt-4 flex max-w-xl flex-row items-center justify-between gap-5 px-4 text-sm font-medium lg:gap-6"
>
	<div class="flex items-center gap-3">
		<img width="20" height="20" src="/logo.svg" alt="Branding" />
		<a href="/" class="text-lg font-semibold md:text-base"> FormBin </a>
	</div>

	<div class="flex items-center gap-5">
		{#if data.user !== null}
			<a href="/app/forms" class="text-foreground transition-colors"> My Forms </a>
			<a href="/app/account" class="text-foreground transition-colors"> Account </a>
		{:else}
			<a href="/demo" class="text-foreground transition-colors"> Demo </a>
			<a href="/auth/login" class="text-foreground transition-colors"> Login </a>
		{/if}

		<Button on:click={toggleMode} variant="outline" class="p-0 text-xs" size="icon">
			<Sun
				class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</nav>

<main class="mx-auto mt-10 max-w-xl px-4">
	{@render children()}
</main>

<Toaster />
<ModeWatcher />

<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

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
	</div>
</nav>

<main class="mx-auto mt-10 max-w-xl px-4">
	{@render children()}
</main>

<Toaster />

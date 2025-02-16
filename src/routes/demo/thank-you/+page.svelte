<script lang="ts">
	import Terminal from 'lucide-svelte/icons/terminal';
	import * as Alert from '$lib/components/ui/alert/index.ts';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Thank you!</h1>
		<p class="text-sm text-muted-foreground">Submission successfully sent</p>
	</div>

	<Alert.Root>
		<Terminal class="h-4 w-4" />
		<Alert.Title>Next steps</Alert.Title>
		<Alert.Description class="mb-4"
			>Bring your own form to life in a couple of minutes.</Alert.Description
		>
		{#if data.user !== null}
			<a href="/app/forms" class="w-full">
				<Button variant="secondary" class="w-full">My forms</Button></a
			>
		{:else}
			<a href="/auth/login" class="w-full">
				<Button variant="secondary" class="w-full">Login</Button></a
			>
		{/if}
	</Alert.Root>
</div>

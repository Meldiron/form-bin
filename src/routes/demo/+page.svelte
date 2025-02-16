<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let isLoading = $state(false);

	let name = $state('');
	let message = $state('');

	function onSubmit() {
		isLoading = true;
		// Default behaviour takes care of the rest
	}

	const formId = '67b1b4f7001e867f2dc3';
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Demo form</h1>
		<p class="text-sm text-muted-foreground">Send us a message to experience form submission</p>
	</div>

	<form
		onsubmit={onSubmit}
		action={window.location.origin + '/s/67b1b4f7001e867f2dc3'}
		method="POST"
		enctype="multipart/form-data"
		class="mx-auto flex w-full max-w-sm flex-col gap-4"
	>
		<div class="flex w-full flex-col gap-2">
			<Label for="name">Your name</Label>
			<Input
				required={true}
				bind:value={name}
				type="text"
				name="name"
				id="name"
				placeholder="John Doe"
			/>
		</div>

		<div class="flex w-full flex-col gap-2">
			<Label for="message">Message</Label>
			<Textarea
				required={true}
				bind:value={message}
				name="message"
				id="message"
				placeholder="Type something. Anything. Tell us a joke."
			/>
		</div>

		<div class="w-full">
			<Button type="submit" class="w-full">
				{#if isLoading}
					<LoaderCircle class="h-4 w-4 animate-spin" />
				{:else}
					<p>Send message</p>
				{/if}
			</Button>
		</div>
	</form>
</div>

<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import hljs from 'highlight.js';
	import Clipboard from 'lucide-svelte/icons/clipboard';
	import Check from 'lucide-svelte/icons/check';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { databases } from '$lib/appwrite';
	import { goto, invalidateAll } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let text = `<form
  action="https:/formbin.vercel.app/s/${data.form.$id}"
  method="POST"
  enctype="multipart/form-data"
>
    <input name="sender" placeholder="Your name" />
    <textarea name="message" placeholder="Hi, ..."></textarea>
    
    <button type="submit">Send</button>
</form>`;
	let copied = $state(false);

	let existing1 = `<form>
	/* Your inputs here */
</form>`;

	let existing2 = `<form
 action="https:/formbin.vercel.app/s/${data.form.$id}"
  method="POST"
  enctype="multipart/form-data"
>

/* The rest */
`;

	let existing3 = `<input	name="sender" />`;

	function copyToClipboard() {
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	onMount(() => {
		hljs.highlightAll();
	});

	let isSkipping = $state(false);
	async function skip() {
		isSkipping = true;

		try {
			await databases.updateDocument('main', 'forms', data.form.$id, {
				pinged: true
			});
			await invalidateAll();
			goto(`/app/forms/${data.form.$id}`);
			toast.success('Onboarding skipped successfully.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isSkipping = false;
		}
	}

	let isChecking = $state(false);
	async function check() {
		isChecking = true;

		try {
			await invalidateAll();
			toast.success('Onboarding completed successfully.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isChecking = false;
		}
	}
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Let’s setup your form</h1>
		<p class="text-sm text-muted-foreground">
			Follow below steps of onboarding to connect your HTML form
		</p>
	</div>

	<div class="flex flex-col space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Description
					class="-mt-1 mb-2 w-[fit-content] rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
					>Step 1 of 3</Card.Description
				>
				<Card.Title>Prepare HTML</Card.Title>
				<Card.Description>Connect existing code, or copy our template.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<Tabs.Root value="new" class="w-full">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="new">Copy our template</Tabs.Trigger>
						<Tabs.Trigger value="existing">Hook your HTML</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="new">
						<div class="relative overflow-x-auto rounded-md bg-muted p-3">
							<button
								onclick={copyToClipboard}
								class="absolute right-2 top-2 rounded-md bg-foreground px-2 py-0.5 text-background"
							>
								{#if copied}
									<Check class="w-4" />
								{:else}
									<Clipboard class="w-4" />
								{/if}
							</button>
							<pre class="text-xs"><code class="language-html">{text}</code></pre>
						</div>
					</Tabs.Content>
					<Tabs.Content value="existing">
						<Card.Root>
							<Card.Content class="flex flex-col gap-10">
								<div class="space-y-2">
									<p class="text-sm font-medium leading-none">1. Wrap inputs in form</p>
									<div class="w-full max-w-full overflow-x-auto rounded-lg">
										<pre class="text-xs"><code class="language-html">{existing1}</code></pre>
									</div>
								</div>

								<div class="space-y-2">
									<p class="text-sm font-medium leading-none">2. Hook your form</p>
									<div class="w-full max-w-full overflow-x-auto rounded-lg">
										<pre class="text-xs"><code class="language-html">{existing2}</code></pre>
									</div>
								</div>

								<div class="space-y-2">
									<p class="text-sm font-medium leading-none">3. Ensure all inputs have names</p>
									<div class="w-full max-w-full overflow-x-auto rounded-lg">
										<pre class="text-xs"><code class="language-html">{existing3}</code></pre>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description
					class="-mt-1 mb-2 w-[fit-content] rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
					>Step 2 of 3</Card.Description
				>
				<Card.Title>Visit your website</Card.Title>
				<Card.Description>Run your website locally, or deploy to production.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				Locally, websites usually run on
				<a class="text-blue-500" href="http://localhost:3000/" target="_blank">localhost:3000</a>,
				<a class="text-blue-500" href="http://localhost:4200/" target="_blank">localhost:4200</a>,
				<a class="text-blue-500" href="http://localhost:5173/" target="_blank">localhost:5173</a>,
				or
				<a class="text-blue-500" href="http://localhost:8080/" target="_blank">localhost:8080</a>.
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description
					class="-mt-1 mb-2 w-[fit-content] rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
					>Step 3 of 3</Card.Description
				>
				<Card.Title>Send your first submission</Card.Title>
				<Card.Description>Fill inputs on your website, and submit the form.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="col-span-6 grid gap-3 sm:grid-cols-12">
					<Button
						disabled={isSkipping}
						onclick={skip}
						type="button"
						variant="secondary"
						class="col-span-6 w-full"
					>
						{#if isSkipping}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Skip</span>
						{/if}
					</Button>

					<Button onclick={check} disabled={isChecking} type="button" class="col-span-6 w-full">
						{#if isChecking}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Check</span>
						{/if}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

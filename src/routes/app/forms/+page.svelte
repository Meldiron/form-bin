<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.ts';
	import Plus from 'lucide-svelte/icons/plus';
	import { LoaderCircle } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { databases } from '$lib/appwrite.js';
	import { ID } from 'appwrite';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let isLoading = $state(false);
	let name = $state('');
	let returnUrl = $state('');

	async function onSubmit(event: Event) {
		event.preventDefault();

		isLoading = true;

		try {
			const form = await databases.createDocument('main', 'forms', ID.unique(), {
				name: name,
				returnUrl: returnUrl
			});
			await invalidateAll();
			goto(`/app/forms/${form.$id}`);
			toast.success('Form successfully created.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isLoading = false;
		}
	}

	function getHostname(url: string): string {
		if (!url) {
			return '';
		}
		const urlObj = new URL(url);
		return urlObj.hostname;
	}
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">My forms</h1>
		<p class="text-sm text-muted-foreground">Collection of all forms in your account</p>
	</div>

	<div class="grid grid-cols-12 gap-4">
		{#each data.forms.documents as form}
			<a href={`/app/forms/${form.$id}`} class="col-span-12 w-full sm:col-span-6">
				<Card.Root class="w-full hover:border-muted-foreground">
					<Card.Header>
						<Card.Title class="text-sm font-medium">
							<code class="line-clamp-1">
								{getHostname(form.returnUrl)}
							</code>
						</Card.Title>
					</Card.Header>
					<Card.Content class="-mt-2">
						<div class="line-clamp-1 text-2xl font-bold">{form.name}</div>
						<p class="mt-1.5 text-xs text-muted-foreground">
							{data.submissions[form.$id]} total submissions
						</p>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}

		<AlertDialog.Root>
			<AlertDialog.Trigger
				class={data.forms.total === 0 || data.forms.total % 2 === 0
					? 'col-span-12'
					: 'col-span-12 sm:col-span-6'}
			>
				<button type="button" class="w-full">
					<Card.Root class="group w-full hover:border-muted-foreground">
						<Card.Header>
							<Card.Title class="text-center text-lg font-medium">Create Form</Card.Title>
						</Card.Header>
						<Card.Content class="flex justify-center">
							<div
								class="rounded-full bg-muted p-3 group-hover:bg-primary group-hover:text-background"
							>
								<Plus class="h-4 w-4" />
							</div>
						</Card.Content>
					</Card.Root></button
				>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Creat a new form</AlertDialog.Title>
					<AlertDialog.Description>
						You will connect your HTML <code>&lt;form&gt;</code> in next step.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<form onsubmit={onSubmit} class="mx-auto flex w-full flex-col gap-4">
					<div class="flex w-full flex-col gap-2">
						<Label for="name">Form name</Label>
						<Input bind:value={name} type="text" id="name" placeholder="My cool form" />
					</div>

					<div class="flex w-full flex-col gap-2">
						<Label for="return-url">Return URL</Label>
						<Input
							required={true}
							bind:value={returnUrl}
							id="return-url"
							placeholder="https://myapp.com/thank-you"
						/>
					</div>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action type="submit" class="w-full">
							{#if isLoading}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								<span>Create</span>
							{/if}
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</form>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</div>

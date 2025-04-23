<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { databases, helperForUrl } from '$lib/appwrite';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.ts';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let { data } = $props();

	let isLoading = $state(false);
	async function onSubmit(event: Event) {
		event.preventDefault();

		isLoading = true;

		try {
			await databases.updateDocument('main', 'forms', data.form.$id, {
				name: data.form.name,
				returnUrl: helperForUrl(data.form.returnUrl)
			});
			await invalidateAll();
			toast.success('Form successfully updated.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isLoading = false;
		}
	}

	let isDeleting = $state(false);
	async function deleteForm() {
		isDeleting = true;

		try {
			await databases.deleteDocument('main', 'forms', data.form.$id);
			await invalidateAll();
			goto('/app/forms');
			toast.success('Form successfully deleted.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isDeleting = false;
		}
	}

	let isIntegrating = $state(false);
	async function onIntegrate() {
		isIntegrating = true;

		try {
			await databases.updateDocument('main', 'forms', data.form.$id, {
				discordUrl: data.form.discordUrl
			});
			await invalidateAll();
			toast.success('Discord integration saved.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isIntegrating = false;
		}
	}

	let isAntiSpamSaving = $state(false);
	async function onAntiSpamSave() {
		isAntiSpamSaving = true;

		try {
			await databases.updateDocument('main', 'forms', data.form.$id, {
				stopForumSpam: data.form.stopForumSpam,
				captcha2: data.form.captcha2
			});
			await invalidateAll();
			toast.success('Anti spam saved.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isAntiSpamSaving = false;
		}
	}

	let captchaModalOpened = $state(false);
	$effect(() => {
		if (captchaModalOpened !== undefined) {
			hljs.highlightAll();
		}
	});
	let escapedScript = 'script';
	let captchaCode1 = `<html>
  <head>
    ...
  </head>
  <body>
    ...
    
    <script src="https://cdn.jsdelivr.net/npm/@cap.js/widget"></${escapedScript}>
  </body>
</html>`;

	let captchaCode2 = `<form ...>
  ...
  
  <cap-widget
    data-cap-api-endpoint="http://formbin.almostapps.eu/captcha/"
  ></cap-widget>
  
  ...
</form>`;

	let formName = $derived(
		data.form.name.length <= 10 ? data.form.name : data.form.name.slice(0, 10) + '...'
	);
</script>

<Breadcrumb.Root class="mb-6 flex justify-center">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/forms">Forms</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href={`/app/forms/${data.form.$id}`}>{formName}</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href={`/app/forms/${data.form.$id}/settings`}>Settings</Breadcrumb.Link>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">{data.form.name}</h1>
		<p class="text-sm text-muted-foreground">Manage your form, and setup automations</p>
	</div>

	<div class="w-full flex-col justify-center space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Form settings</Card.Title>
				<Card.Description>Edit your form configuration.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<form onsubmit={onSubmit} class="mx-auto flex w-full flex-col gap-4">
					<div class="flex w-full flex-col gap-2">
						<Label for="name">Form name</Label>
						<Input
							required={true}
							bind:value={data.form.name}
							type="text"
							id="name"
							placeholder="My cool form"
						/>
					</div>

					<div class="flex w-full flex-col gap-2">
						<Label for="return-url">Return URL</Label>
						<Input
							required={true}
							bind:value={data.form.returnUrl}
							id="return-url"
							placeholder="https://myapp.com/thank-you"
						/>
					</div>

					<Button disabled={isLoading} type="submit" class="w-full">
						{#if isLoading}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Update</span>
						{/if}
					</Button>
				</form>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="border-orange-500">
			<Card.Header>
				<Card.Title>Anti-spam protection</Card.Title>
				<Card.Description>Tools to ignore unwanted submissions.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<form onsubmit={onAntiSpamSave} class="mx-auto flex w-full flex-col gap-4">
					<div class="flex flex-row items-center justify-between rounded-lg border p-4">
						<div class="space-y-0.5">
							<Label>Stop Forum Spam</Label>
							<Card.Description>
								If any form value includes email address from <a
									class="text-orange-500"
									href="https://www.stopforumspam.com/"
									target="_blank">stopforumspam.com</a
								> database, it will be ignored.
							</Card.Description>
						</div>
						<Switch bind:checked={data.form.stopForumSpam} />
					</div>
					<div class="rounded-lg border p-4">
						<div class="flex flex-row items-center justify-between">
							<div class="space-y-0.5">
								<Label>Proof-of-work captcha</Label>
								<Card.Description>
									"I'm a human" integration powered by <a
										class="text-orange-500"
										href="https://capjs.js.org/"
										target="_blank">Cap</a
									> to reduce spam by making it costly.
								</Card.Description>
							</div>

							<Switch bind:checked={data.form.captcha2} />
						</div>

						{#if data.form.captcha2 === true}
							<Alert.Root class="mt-4">
								<TriangleAlert class="h-4 w-4" />
								<Alert.Title>Integration required!</Alert.Title>
								<Alert.Description
									>You need to include Cap input in your form.

									<Dialog.Root bind:open={captchaModalOpened}>
										<Dialog.Trigger class="text-orange-500">Learn more</Dialog.Trigger>
										<Dialog.Content class="sm:max-w-[600px]">
											<Dialog.Header>
												<Dialog.Title>Captcha integration</Dialog.Title>
											</Dialog.Header>
											<p>1. Import Cap widget library</p>
											<div class="w-full max-w-full overflow-x-auto rounded-lg">
												<pre class="text-xs"><code class="language-html">{captchaCode1}</code></pre>
											</div>

											<hr />

											<p>2. Add Cap widget</p>
											<div class="w-full max-w-full overflow-x-auto rounded-lg">
												<pre class="text-xs"><code class="language-html">{captchaCode2}</code></pre>
											</div>
											<Dialog.Footer>
												<Button
													variant="secondary"
													type="button"
													on:click={() => (captchaModalOpened = false)}>Close</Button
												>
											</Dialog.Footer>
										</Dialog.Content>
									</Dialog.Root>
								</Alert.Description>
							</Alert.Root>
						{/if}
					</div>

					<Button
						class="w-full bg-orange-500 text-white hover:bg-orange-600 hover:bg-opacity-90"
						disabled={isAntiSpamSaving}
						type="submit"
					>
						{#if isAntiSpamSaving}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Update</span>
						{/if}
					</Button>
				</form>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="border-[#5865F2]">
			<Card.Header>
				<Card.Title>Discord integration</Card.Title>
				<Card.Description>Recieve Discord message for every new submission.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<form onsubmit={onIntegrate} class="mx-auto flex w-full flex-col gap-4">
					<div class="flex w-full flex-col gap-2">
						<Label for="name">Webhook URL</Label>
						<Input
							required={true}
							bind:value={data.form.discordUrl}
							type="text"
							id="name"
							placeholder="https://discord.com/api/webhooks/..."
						/>
					</div>

					<p class="-mt-2 ml-3 text-xs text-muted-foreground">
						If you are not familiar with Discord server webhooks, follow "Making a Webhook" section
						of
						<a
							class="text-blue-500"
							href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
							target="_blank">Intro to Webhooks</a
						> article.
					</p>

					<Button
						class="w-full bg-[#5865F2] text-white hover:bg-[#5865F2] hover:bg-opacity-90"
						disabled={isIntegrating}
						type="submit"
					>
						{#if isIntegrating}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Update</span>
						{/if}
					</Button>
				</form>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="border-destructive">
			<Card.Header>
				<Card.Title>Delete form</Card.Title>
				<Card.Description>Form and it's submissions will be permanently deleted.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<AlertDialog.Root>
					<AlertDialog.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							disabled={isDeleting}
							type="button"
							variant="destructive"
							class="w-full"
						>
							{#if isDeleting}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								<span>Delete</span>
							{/if}
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								You are about to delete form and it's submissions. This will delete it permanently.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action onclick={deleteForm}>Continue</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</Card.Footer>
		</Card.Root>
	</div>
</div>

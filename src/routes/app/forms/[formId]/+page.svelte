<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.ts';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Alert from '$lib/components/ui/alert/index.ts';
	import { toast } from 'svelte-sonner';
	import { databases, type AppwriteSubmission } from '$lib/appwrite.js';
	import { Query } from 'appwrite';
	import { PAGE_LIMIT } from './consts.js';
	import { LoaderCircle, Trash, Clipboard, Check, Info } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';

	let { data } = $props();

	let submissions = $state(data.submissions.documents);

	let formName = $derived(
		data.form.name.length <= 10 ? data.form.name : data.form.name.slice(0, 10) + '...'
	);

	let showLoadMore = $state(submissions.length === PAGE_LIMIT);
	let isLoading = $state(false);
	async function loadMore() {
		isLoading = true;

		try {
			const lastDoc = submissions[submissions.length - 1];
			if (!lastDoc) {
				showLoadMore = false;
			}

			const newSubmissions = await databases.listDocuments<AppwriteSubmission>(
				'main',
				'submissions',
				[
					Query.orderDesc('$id'),
					Query.equal('formId', data.form.$id),
					Query.cursorAfter(lastDoc.$id),
					Query.limit(PAGE_LIMIT)
				]
			);

			if (newSubmissions.documents.length !== PAGE_LIMIT) {
				showLoadMore = false;
			}

			for (const submission of newSubmissions.documents) {
				submission.data = JSON.parse(submission.values);
			}

			submissions.push(...newSubmissions.documents);
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isLoading = false;
		}
	}

	function getDate(date: string): string {
		const dateObj = new Date(date);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};
		return dateObj.toLocaleDateString(undefined, options);
	}

	let openedSubmissions: string[] = $state([]);
	function toggleSubmission(id: string) {
		if (!openedSubmissions.includes(id)) {
			openedSubmissions.push(id);
		} else {
			openedSubmissions = openedSubmissions.filter((submissionId) => submissionId !== id);
		}
	}

	let copied = $state(false);
	function copyToClipboard(submission: AppwriteSubmission) {
		let texts = [];

		for (const key of Object.keys(submission.data)) {
			const value = submission.data[key];
			texts.push(`${key}:\n${value}`);
		}

		navigator.clipboard.writeText(texts.join('\n\n'));

		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	let isDeleting = $state(false);
	async function deleteSubmission(submission: AppwriteSubmission) {
		isDeleting = true;

		try {
			await databases.deleteDocument('main', 'submissions', submission.$id);
			submissions = submissions.filter((s) => s.$id !== submission.$id);
			toast.success('Submission deleted successfully');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isDeleting = false;
		}
	}
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
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">{data.form.name}</h1>
		<p class="text-sm text-muted-foreground">View your form's submissions</p>
	</div>

	<div class="w-full flex-col justify-center space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Submissions</Card.Title>
				<Card.Description>Record of all values from submissions.</Card.Description>
			</Card.Header>

			<Card.Content>
				<div class="flex flex-col gap-4">
					{#if submissions.length === 0}
						<Alert.Root>
							<Info class="h-4 w-4" />
							<Alert.Title>No submissions</Alert.Title>
							<Alert.Description>New submissions from your HTML will appear here.</Alert.Description
							>
						</Alert.Root>
					{/if}
					{#each submissions as submission}
						<Alert.Root
							class={`relative overflow-hidden pb-1.5 ${openedSubmissions.includes(submission.$id) ? '' : 'max-h-[80px]'}`}
						>
							<Alert.Title class="mb-4 text-xs font-light uppercase"
								>{getDate(submission.$createdAt)}</Alert.Title
							>
							<div class="flex flex-col gap-4">
								{#each Object.keys(submission.data) as key}
									<div>
										<p class="text-xs text-muted-foreground">{key}:</p>
										<div>
											{#each submission.data[key].split('\r\n') as value}
												{#if value}
													<p class="text-sm text-primary">{value}</p>
												{:else}
													<div class="h-2"></div>
												{/if}
											{/each}
										</div>
									</div>
								{/each}

								<div>
									<p class="mb-1.5 text-xs text-muted-foreground">actions:</p>
									<div class="flex items-center gap-2">
										<Button
											onclick={() => copyToClipboard(submission)}
											size="sm"
											variant="secondary"
											class=""
										>
											{#if copied}
												<Check class="w-4" />
											{:else}
												<Clipboard class="h-4 w-4" />
											{/if}
										</Button>

										<AlertDialog.Root>
											<AlertDialog.Trigger asChild let:builder>
												<Button
													disabled={isDeleting}
													builders={[builder]}
													size="sm"
													variant="destructive"
													class=""
												>
													{#if isDeleting}
														<LoaderCircle class="h-4 w-4 animate-spin" />
													{:else}
														<Trash class="h-4 w-4" />
													{/if}
												</Button>
											</AlertDialog.Trigger>
											<AlertDialog.Content>
												<AlertDialog.Header>
													<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
													<AlertDialog.Description>
														You are about to delete one form's submission. This will delete it
														permanently.
													</AlertDialog.Description>
												</AlertDialog.Header>
												<AlertDialog.Footer>
													<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
													<AlertDialog.Action onclick={() => deleteSubmission(submission)}
														>Continue</AlertDialog.Action
													>
												</AlertDialog.Footer>
											</AlertDialog.Content>
										</AlertDialog.Root>
									</div>
								</div>
							</div>

							<div
								class={`${openedSubmissions.includes(submission.$id) ? '' : 'absolute bottom-0 left-0 h-8'}  flex w-full justify-center bg-gradient-to-t from-background to-background/25`}
							>
								<div class="">
									<Button onclick={() => toggleSubmission(submission.$id)} variant="link" class="">
										<ChevronDown
											class={`h-4 w-4 ${openedSubmissions.includes(submission.$id) ? 'rotate-180' : ''}`}
										/>
									</Button>
								</div>
							</div>
						</Alert.Root>
					{/each}
				</div>

				{#if showLoadMore}
					<Button disabled={isLoading} onclick={loadMore} variant="secondary" class="mt-4 w-full">
						{#if isLoading}
							<LoaderCircle class="h-4 w-4 animate-spin" />
						{:else}
							<span>Load more</span>
						{/if}
					</Button>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<div class="w-full flex-col justify-center space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Form onboarding</Card.Title>
				<Card.Description>Revisit onboarding to obtain HTML form snippets.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<a class="w-full" href={`/app/forms/${data.form.$id}/onboarding?visitor`}>
					<Button type="button" variant="outline" class="w-full">Visit onboarding</Button>
				</a>
			</Card.Footer>
		</Card.Root>
	</div>

	<div class="w-full flex-col justify-center space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Form configuration</Card.Title>
				<Card.Description>Manage, delete, and integrate your form.</Card.Description>
			</Card.Header>

			<Card.Footer class="mt-4">
				<a class="w-full" href={`/app/forms/${data.form.$id}/settings`}>
					<Button type="button" variant="outline" class="w-full">Open settings</Button>
				</a>
			</Card.Footer>
		</Card.Root>
	</div>
</div>

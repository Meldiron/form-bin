<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';

	let { data } = $props();

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
				<Card.Title>Submission</Card.Title>
				<Card.Description>Record of all values from submissions.</Card.Description>
			</Card.Header>

			<Card.Content>
				<p>aa</p>
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

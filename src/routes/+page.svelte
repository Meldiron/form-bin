<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { ArrowRight, Bell, Cog, GitBranch, GraduationCap, Wallet } from 'lucide-svelte';

	let { data } = $props();

	const featureList = [
		{
			title: '100% Free',
			description:
				'You will never enter credit card, or hit any limit. All features are included for everyone.'
		},
		{
			title: 'Open source',
			description: 'You can fully customize FormBin to your needs, or contribute to our community.'
		},
		{
			title: 'Discord integration',
			description: 'Recieve notifications on your Discord server when a form is submitted.'
		},
		{
			title: 'Simple onboarding',
			description: 'We focus on quick and ease onboarding so you can connect your forms in minuts.'
		}
	];

	const serviceList = [
		{
			title: 'Contact form',
			description: 'Best friend for portfolio and presenation pages.'
		},
		{
			title: 'Newsletter leads',
			description: 'Product pages collecting emails of interested customers.'
		},
		{
			title: 'Surveys form',
			description: 'Any kind of research could benefit from custom website.'
		},
		{
			title: 'Feedback forms',
			description: 'Your users are the best source how to improve your product.'
		}
	];
</script>

<section class="w-full">
	<div class="mx-auto pt-12">
		<div class="space-y-8 text-center">
			<Badge variant="outline" class="py-2 text-sm">
				<span class="mr-2 text-primary">
					<Badge>New</Badge>
				</span>
				<span> Discord integration </span>
			</Badge>

			<div class="mx-auto max-w-lg text-center text-4xl font-bold md:text-6xl">
				<h1 class="text-primary text-opacity-30">
					Give
					<span class="px-2 text-primary"> Life </span>
					to your HTML forms.
				</h1>
			</div>

			<p class="mx-auto max-w-screen-sm text-xl text-primary">
				{`Simple and powerful backend for your HTML forms.`}
			</p>

			<div class="flex items-center justify-center gap-4">
				{#if data.user === null}
					<a href="/auth/login">
						<Button class="group/arrow font-bold">
							Get Started
							<ArrowRight
								class="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1"
							/>
						</Button>
					</a>
				{:else}
					<a href="/app/forms">
						<Button class="group/arrow font-bold">
							Manage forms
							<ArrowRight
								class="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1"
							/>
						</Button>
					</a>
				{/if}

				<a href="/demo">
					<Button variant="secondary" class="font-bold">Try demo</Button>
				</a>
			</div>
		</div>

		<div class="group relative mt-14">
			<div
				class="absolute left-1/2 top-2 mx-auto h-24 -translate-x-1/2 transform rounded-full bg-primary/50 blur-3xl lg:-top-8 lg:h-80"
			></div>
			<img
				width={1200}
				class="rouded-lg relative mx-auto flex hidden w-full items-center rounded-lg rounded-b-2xl border border-2 border-secondary leading-none dark:block"
				src="/screenshot-dark.png"
				alt="dashboard"
			/>

			<img
				width={1200}
				class="rouded-lg relative mx-auto block flex w-full items-center rounded-lg rounded-b-2xl border border-2 border-secondary leading-none dark:hidden"
				src="/screenshot-light.png"
				alt="dashboard"
			/>

			<div
				class="absolute bottom-0 left-0 h-20 w-full rounded-lg bg-gradient-to-b from-background/0 via-background/50 to-background md:h-28"
			></div>
		</div>
	</div>
</section>

<section id="features" class="container py-20">
	<h2 class="mb-2 text-center text-lg tracking-wider text-primary">Features</h2>

	<h2 class="mb-4 text-center text-3xl font-bold md:text-4xl">What makes us different?</h2>

	<h3 class="mx-auto mb-8 max-w-lg text-center text-xl text-muted-foreground">
		FormBin focuses on simplicity and ease of use for the most junior developers all around the
		globe.
	</h3>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each featureList as { title, description }, index}
			<div>
				<Card class="h-full border-0 bg-background shadow-none">
					<CardHeader class="flex items-center justify-center">
						<div class="mb-4 rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
							{#if index === 0}
								<Wallet size={24} color="hsl(var(--primary))" class="text-primary" />
							{:else if index === 1}
								<GitBranch size={24} color="hsl(var(--primary))" class="text-primary" />
							{:else if index === 2}
								<Bell size={24} color="hsl(var(--primary))" class="text-primary" />
							{:else if index === 3}
								<GraduationCap size={24} color="hsl(var(--primary))" class="text-primary" />
							{/if}
						</div>

						<CardTitle>{title}</CardTitle>
					</CardHeader>

					<CardContent class="text-center text-muted-foreground">
						{description}
					</CardContent>
				</Card>
			</div>
		{/each}
	</div>
</section>

<section id="services" class="container py-20">
	<h2 class="mb-2 text-center text-lg tracking-wider text-primary">Services</h2>

	<h2 class="mb-4 text-center text-3xl font-bold md:text-4xl">When can FormBin help?</h2>
	<h3 class="mx-auto mb-8 max-w-lg text-center text-xl text-muted-foreground">
		There are countless use cases for FormBin, but here are some of the most common ones.
	</h3>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>

	<div class="mx-auto grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2">
		{#each serviceList as { title, description }, index}
			<Card class="relative h-full bg-muted/60 dark:bg-card">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription class="pb-4">{description}</CardDescription>
				</CardHeader>
			</Card>
		{/each}
	</div>
</section>

<section id="community" class="py-12">
	<hr class="border-secondary" />
	<div class="container py-20 sm:py-20">
		<div class=" mx-auto">
			<Card
				class="flex flex-col items-center justify-center border-none bg-background text-center shadow-none"
			>
				<CardHeader>
					<CardTitle class="flex flex-col items-center text-4xl font-bold md:text-5xl">
						<div>
							Ready to start using
							<span
								class="bg-gradient-to-r from-primary via-[#df6b39] to-primary bg-clip-text pl-2 text-transparent"
							>
								FormBin?
							</span>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent class="max-w-lg text-xl text-muted-foreground">
					Getting started with FormBin only takes a few minutes. Start using it for free today.
				</CardContent>

				<CardFooter>
					{#if data.user === null}
						<a href="/auth/login">
							<Button class="group/arrow font-bold">
								Get Started
								<ArrowRight
									class="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1"
								/>
							</Button>
						</a>
					{:else}
						<a href="/app/forms">
							<Button class="group/arrow font-bold">
								Manage forms
								<ArrowRight
									class="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1"
								/>
							</Button>
						</a>
					{/if}
				</CardFooter>
			</Card>
		</div>
	</div>
	<hr class="border-secondary" />
</section>

<footer>
	<p class="mt-12 flex items-center justify-center text-center text-sm">
		Made with ❤️ and <a href="https://appwrite.io/" target="_blank"
			><img alt="Appwrite" src="/appwrite-dark.svg" class="ml-2 inline hidden h-4 dark:block" />
			<img alt="Appwrite" src="/appwrite-light.svg" class="ml-2 block inline h-4 dark:hidden" /></a
		>
	</p>
	<p class="mt-1.5 text-center text-sm text-muted-foreground">
		Source code available on <a
			href="https://github.com/Meldiron/form-bin"
			class="underline"
			target="_blank">GitHub</a
		>
	</p>
</footer>

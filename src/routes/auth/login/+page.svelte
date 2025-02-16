<script lang="ts">
	import { account } from '$lib/appwrite';
	import { Button } from '$lib/components/ui/button';
	import { OAuthProvider } from 'appwrite';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.ts';

	let { data } = $props();

	let isLoading = $state(false);
	let error = $state('');

	onMount(async () => {
		if (data.secret && data.userId) {
			isLoading = true;
			try {
				await account.createSession(data.userId, data.secret);
				await invalidateAll();
				goto('/app');
			} catch (err: any) {
				error = err.message ? err.message : err.toString();
				console.error(err);
				isLoading = false;
			}
		}
	});

	async function signIn() {
		isLoading = true;
		await account.createOAuth2Token(
			OAuthProvider.Github,
			window.location.origin + '/auth/login',
			window.location.origin + '/auth/login'
		);
	}
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Sign into your account</h1>
		<p class="text-sm text-muted-foreground">Use your GitHub account to login with one click</p>
	</div>

	<div class="flex w-full justify-center">
		<Button
			onclick={signIn}
			class="w-full max-w-sm"
			variant="outline"
			type="button"
			disabled={isLoading}
		>
			{#if isLoading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<svg
					class="mr-2 h-5 w-5 text-foreground"
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="100"
					height="100"
					viewBox="0 0 30 30"
				>
					<path
						fill="currentColor"
						d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
					></path>
				</svg>
			{/if}
			GitHub
		</Button>
	</div>

	{#if error}
		<Alert.Root variant="destructive">
			<CircleAlert class="h-4 w-4" />
			<Alert.Title class="text-primary">Login failed</Alert.Title>
			<Alert.Description class="text-muted-foreground">{error}</Alert.Description>
		</Alert.Root>
	{/if}

	<p class="px-8 text-center text-sm text-muted-foreground">
		By clicking continue, you agree to our
		<a
			href="https://appwrite.io/terms"
			target="_blank"
			class="underline underline-offset-4 hover:text-primary"
		>
			Terms of Service
		</a>
		and
		<a
			href="https://appwrite.io/privacy"
			target="_blank"
			class="underline underline-offset-4 hover:text-primary"
		>
			Privacy Policy
		</a>
	</p>
</div>

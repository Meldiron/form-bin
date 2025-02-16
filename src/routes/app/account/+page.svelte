<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { account } from '$lib/appwrite';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(false);

	async function onSubmit() {
		isLoading = true;

		try {
			await account.deleteSession('current');
			await invalidateAll();
			toast.success('Successfully signed out.');
		} catch (err: any) {
			toast.error(err.message ? err.message : err.toString());
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="w-full flex-col justify-center space-y-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Your session</Card.Title>
			<Card.Description>To keep your account secure, sign out when you're done.</Card.Description>
		</Card.Header>

		<Card.Footer class="mt-4">
			<Button disabled={isLoading} onclick={onSubmit} type="button" variant="outline" class="w-full"
				>Log out</Button
			>
		</Card.Footer>
	</Card.Root>
</div>

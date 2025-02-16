<script lang="ts">
	let { data } = $props();
</script>

<div class="w-full flex-col justify-center space-y-6">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">An error occured</h1>
		<p class="text-sm text-muted-foreground">{data.message}</p>
	</div>
</div>

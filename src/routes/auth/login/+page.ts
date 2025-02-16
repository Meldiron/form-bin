import { invalidateAll } from '$app/navigation';
import { account } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const secret = url.searchParams.get('secret') ?? '';
	const userId = url.searchParams.get('userId') ?? '';

	if (secret && userId) {
		let ok = false;
		try {
			await account.createSession(userId, secret);
			await invalidateAll();
			ok = true;
		} catch (err: unknown) {
			console.error(err);
			throw redirect(302, '/auth');
		}

		if (ok) {
			throw redirect(302, '/app');
		}
	}

	return {};
};

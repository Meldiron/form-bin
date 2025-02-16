import { account } from '$lib/appwrite';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
	let user = null;

	try {
		user = await account.get();
	} catch (err) {
		console.warn(err);
	}
	return {
		user
	};
};

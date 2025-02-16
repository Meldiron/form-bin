import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const secret = url.searchParams.get('secret') ?? '';
	const userId = url.searchParams.get('userId') ?? '';

	return {
		secret,
		userId
	};
};

import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();

	if (data.user === null) {
		throw redirect(302, '/auth');
	} else {
		throw redirect(302, '/app');
	}
};

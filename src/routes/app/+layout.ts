import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();

	if (data.user === null) {
		throw redirect(302, '/auth');
	}

	return {};
};

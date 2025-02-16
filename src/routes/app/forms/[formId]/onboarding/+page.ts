import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent, params, url }) => {
	const data = await parent();

	const visitor = url.searchParams.get('visitor') ?? null;

	if (data.form.pinged && visitor != '') {
		throw redirect(302, `/app/forms/${params.formId}`);
	}

	return {
		visitor: visitor === ''
	};
};

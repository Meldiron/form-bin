import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent, params }) => {
	const data = await parent();

	if (data.form.pinged) {
		throw redirect(302, `/app/forms/${params.formId}`);
	}

	return {};
};

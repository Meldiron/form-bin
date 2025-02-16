import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent, params }: any) => {
	const data = await parent();

	if (!data.form.pinged) {
		throw redirect(302, `/app/forms/${params.formId}/onboarding`);
	}

	return {};
};

import { databases, type AppwriteForm } from '$lib/appwrite';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }: any) => {
	const form = await databases.getDocument<AppwriteForm>('main', 'forms', params.formId);

	return {
		form
	};
};

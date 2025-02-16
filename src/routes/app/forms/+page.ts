import { type AppwriteForm, databases } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	const forms = await databases.listDocuments<AppwriteForm>('main', 'forms', [
		Query.limit(25) // TODO: @Meldiron Pagination
	]);

	return {
		forms
	};
};

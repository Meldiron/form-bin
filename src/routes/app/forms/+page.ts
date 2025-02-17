import { type AppwriteForm, databases } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async () => {
	const forms = await databases.listDocuments<AppwriteForm>('main', 'forms', [
		Query.orderDesc('$id'),
		Query.limit(25) // TODO: @Meldiron Pagination
	]);

	const submissions: { [key: string]: number } = {};

	// TODO: @Meldiron Once paginated, Promise.all here could be unstable
	await Promise.all(
		forms.documents.map(async (form) => {
			const submission = await databases.listDocuments('main', 'submissions', [
				Query.equal('formId', form.$id),
				Query.limit(1)
			]);
			submissions[form.$id] = submission.total;
		})
	);

	return {
		forms,
		submissions
	};
};

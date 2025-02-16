import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { type AppwriteSubmission, databases } from '$lib/appwrite';
import { Query } from 'appwrite';
import { PAGE_LIMIT } from './consts';

export const ssr = false;

export const load: PageLoad = async ({ parent, params }: any) => {
	const data = await parent();

	if (!data.form.pinged) {
		throw redirect(302, `/app/forms/${params.formId}/onboarding`);
	}

	const submissions = await databases.listDocuments<AppwriteSubmission>('main', 'submissions', [
		Query.equal('formId', params.formId),
		Query.limit(PAGE_LIMIT)
	]);

	for (const submission of submissions.documents) {
		submission.data = JSON.parse(submission.values);
	}

	return {
		submissions
	};
};

import { redirect } from '@sveltejs/kit';
import { type AppwriteForm } from '$lib/appwrite';
import { APPWRITE_API_KEY } from '$env/static/private';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

import type { Actions } from './$types';

export const actions = {
	default: async ({ request, params }) => {
		const formId = params.formId;

		if (formId === 'demo') {
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 800);
			});

			throw redirect(302, '/demo/thank-you');
		}

		if (!formId) {
			throw redirect(302, `/s/${formId}?msg=Form could not be found.`);
		}

		const serverClient = new Client();
		serverClient
			.setEndpoint('https://cloud.appwrite.io/v1')
			.setProject('form-bin')
			.setKey(APPWRITE_API_KEY);

		const serverDatabase = new Databases(serverClient);

		let form: AppwriteForm;
		try {
			form = await serverDatabase.getDocument<AppwriteForm>('main', 'forms', formId);
		} catch (err: unknown) {
			throw redirect(302, `/s/${formId}?msg=Form could not be found.`);
		}

		const data = await request.formData();

		const values: Record<string, unknown> = {};

		for (const key of data.keys()) {
			values[key] = data.get(key);
		}

		const json = JSON.stringify(values);

		const userId = form.$permissions[0].split('user:')[1].split('"')[0];

		await serverDatabase.createDocument(
			'main',
			'submissions',
			ID.unique(),
			{
				formId: formId,
				values: json
			},
			[
				Permission.read(Role.user(userId)),
				Permission.update(Role.user(userId)),
				Permission.delete(Role.user(userId))
			]
		);

		if (!form.pinged) {
			await serverDatabase.updateDocument('main', 'forms', formId, {
				pinged: true
			});
		}

		if (form.discordUrl) {
			let messages = [];

			for (const key of Object.keys(values)) {
				const value = values[key];

				const keyVerbose = key.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());

				messages.push(`**${keyVerbose}:**\n${value}`);
			}

			try {
				await fetch(form.discordUrl, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						content: 'You have a new for submission!',
						embeds: [
							{
								title: form.name,
								description: messages.join('\n\n'),
								color: 14641977,
								author: {
									name: new URL(form.returnUrl).hostname
								},
								footer: {
									text: 'Powered by FormBin.'
								}
							}
						],
						attachments: []
					})
				});
			} catch (err: unknown) {
				// Silented error
				console.log(err);
			}
		}

		throw redirect(302, form.returnUrl);
	}
} satisfies Actions;

export const load = async ({ url }: any) => {
	const msg = url.searchParams.get('msg') ?? 'Unexpected error occured';

	return {
		message: msg
	};
};

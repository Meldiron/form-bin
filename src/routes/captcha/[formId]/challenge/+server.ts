import { json } from '@sveltejs/kit';
import { capEasy, capHard, capMedium } from '$lib/captcha';
import { type AppwriteForm } from '$lib/appwrite';
import { APPWRITE_API_KEY } from '$env/static/private';
import { Client, Databases } from 'node-appwrite';

export async function POST({ params }: any) {
	const formId = params.formId;
	const serverClient = new Client();
	serverClient
		.setEndpoint('https://cloud.appwrite.io/v1')
		.setProject('form-bin')
		.setKey(APPWRITE_API_KEY);
	const serverDatabase = new Databases(serverClient);
	let form: AppwriteForm;
	try {
		form = await serverDatabase.getDocument<AppwriteForm>('main', 'forms', formId);
	} catch {
		return json({
			error: 'Form could not be found.',
			success: false
		});
	}

	const captchaLevel = form.captchaLevel ?? 'none';
	if (captchaLevel === 'none') {
		return json({
			error: 'Captcha is disabled.',
			success: false
		});
	}

	const capInstance =
		captchaLevel === 'easy' ? capEasy : captchaLevel === 'medium' ? capMedium : capHard;
	const captchaCount = captchaLevel === 'easy' ? 8 : captchaLevel === 'medium' ? 16 : 64;

	const challenge = capInstance.createChallenge({
		challengeCount: captchaCount,
		challengeSize: 32,
		challengeDifficulty: 4,
		expiresMs: 600000
	});
	return json(challenge, { status: 200 });
}

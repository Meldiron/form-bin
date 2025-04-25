import { capEasy, capMedium, capHard } from '$lib/captcha';
import { json } from '@sveltejs/kit';
import { type AppwriteForm } from '$lib/appwrite';
import { APPWRITE_API_KEY } from '$env/static/private';
import { Client, Databases } from 'node-appwrite';

export async function POST({ request, params }: any) {
	const { token, solutions } = await request.json();

	if (!token || !solutions) {
		return json({ success: false }, { status: 400 });
	}

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

	const challenge = await capInstance.redeemChallenge({ token, solutions });
	return json(challenge, { status: 200 });
}

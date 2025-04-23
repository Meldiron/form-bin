import { json } from '@sveltejs/kit';
import { cap } from '$lib/captcha';

export async function POST() {
	const challenge = cap.createChallenge({
		challengeCount: 16,
		challengeSize: 32,
		challengeDifficulty: 4,
		expiresMs: 600000
	});
	return json(challenge, { status: 200 });
}

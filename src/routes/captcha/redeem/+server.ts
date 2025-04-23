import { cap } from '$lib/captcha';
import { json } from '@sveltejs/kit';

export async function POST({ request }: any) {
	const { token, solutions } = await request.json();

	if (!token || !solutions) {
		return json({ success: false }, { status: 400 });
	}

	const challenge = await cap.redeemChallenge({ token, solutions });
	return json(challenge, { status: 200 });
}

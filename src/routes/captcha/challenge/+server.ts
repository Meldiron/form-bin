import { json } from '@sveltejs/kit';
import { cap } from '$lib/captcha';

export async function POST() {
	const challenge = cap.createChallenge({
		challengeCount: 32,
		challengeSize: 32,
		challengeDifficulty: 4,
		expiresMs: 600000
	});
	return json(challenge, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
import Cap from '@cap.js/server';
import { CAP_PATH } from '$env/static/private';

export const capEasy = new Cap({
	tokens_store_path: CAP_PATH || '.captcha/tokensListEasy.json'
});

export const capMedium = new Cap({
	tokens_store_path: CAP_PATH || '.captcha/tokensListMedium.json'
});

export const capHard = new Cap({
	tokens_store_path: CAP_PATH || '.captcha/tokensListHard.json'
});

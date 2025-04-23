import Cap from '@cap.js/server';
import { CAP_PATH } from '$env/static/private';

export const cap = new Cap({
	tokens_store_path: CAP_PATH || '.captcha/tokensList.json'
});

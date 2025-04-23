import Cap from '@cap.js/server';

export const cap = new Cap({
	tokens_store_path: '.captcha/tokensList.json'
});

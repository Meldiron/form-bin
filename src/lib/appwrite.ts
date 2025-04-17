import { Client, Account, Databases, type Models } from 'appwrite';

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('form-bin');

export const account = new Account(client);
export const databases = new Databases(client);

export type AppwriteForm = {
	name: string;
	returnUrl: string;
	pinged: boolean;
	discordUrl: string;
	stopForumSpam: boolean;
} & Models.Document;

export type AppwriteSubmission = {
	values: string; // JSON object

	data: Record<string, any>; // Client-side-only!
} & Models.Document;

export function helperForUrl(url: string) {
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = `https://${url}`;
	}

	if (!url.split('//')[1].includes('/')) {
		url = `${url}/`;
	}

	return url;
}

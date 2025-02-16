import { Client, Account, Databases, type Models } from 'appwrite';

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('form-bin');

export const account = new Account(client);
export const databases = new Databases(client);

export type AppwriteForm = {
	name: string;
	returnUrl: string;
	submissions: number;
	pinged: boolean;
	discordUrl: string;
} & Models.Document;

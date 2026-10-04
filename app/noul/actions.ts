'use server';

import { noul, TypeSafeClient } from '@typesafe-ai/sdk';

export type VegetableState =
	| { status: 'idle' }
	| { status: 'success'; word: string; percent: number; json: string }
	| { status: 'error'; message: string };

const MAX_WORD_LENGTH = 100;

const client = new TypeSafeClient({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api',
});

export async function rateVegetable(_prevState: VegetableState, formData: FormData): Promise<VegetableState> {
	const word = String(formData.get('word') ?? '').trim();

	if (!word) {
		return { status: 'error', message: 'Please enter a word.' };
	}
	if (word.length > MAX_WORD_LENGTH) {
		return { status: 'error', message: `Please keep it under ${MAX_WORD_LENGTH} characters.` };
	}

	try {
		const response = await client.systemOne({
			model: 'jev-1.13',
			state: word,
			questions: {
				is_vegetable: noul('Is this a vegetable?'),
			},
		});

		return {
			status: 'success',
			word,
			percent: Math.round(response.answers.is_vegetable.noul * 100),
			json: JSON.stringify(response, null, 2),
		};
	} catch (error) {
		console.error('Jev request failed:', error);
		return { status: 'error', message: 'The model request failed. Please try again.' };
	}
}

'use server';

import { score, TypeSafeClient } from '@typesafe-ai/sdk';
import { EMOJIS } from './emojis';

export type Match = { slug: string; percent: number };

export type EmojiMatchState =
	| { status: 'idle' }
	| { status: 'success'; text: string; matches: Match[]; json: string }
	| { status: 'error'; message: string };

const MAX_TEXT_LENGTH = 200;

const LEVELS = [
	'Unrelated to the description',
	'Loosely associated with it',
	'Clearly related to it',
	'A typical example of it',
] as const;
const TOP_LEVEL = LEVELS.length - 1;
// Level 2: "Clearly related to it"
const MIN_SCORE = 2;

const QUESTIONS = Object.fromEntries(
	EMOJIS.map((e) => [e.slug, score({ emoji: e.name, question: 'How well does `emoji` fit the description?' }, LEVELS)]),
);

const client = new TypeSafeClient({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api',
});

export async function matchEmojis(_prevState: EmojiMatchState, formData: FormData): Promise<EmojiMatchState> {
	const text = String(formData.get('text') ?? '').trim();

	if (!text) {
		return { status: 'error', message: 'Please enter some text.' };
	}
	if (text.length > MAX_TEXT_LENGTH) {
		return { status: 'error', message: `Please keep it under ${MAX_TEXT_LENGTH} characters.` };
	}

	try {
		const response = await client.systemOne({
			model: 'jev-1.13',
			state: text,
			questions: QUESTIONS,
		});

		const matches = Object.entries(response.answers)
			.filter(([, answer]) => answer.score >= MIN_SCORE)
			.sort(([, a], [, b]) => b.score - a.score)
			.map(([slug, answer]) => ({ slug, percent: Math.round((answer.score / TOP_LEVEL) * 100) }));

		return { status: 'success', text, matches, json: JSON.stringify(response, null, 2) };
	} catch (error) {
		console.error('Jev request failed:', error);
		return { status: 'error', message: 'The model request failed. Please try again.' };
	}
}

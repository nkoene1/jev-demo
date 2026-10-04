'use server';

import { choice, TypeSafeClient } from '@typesafe-ai/sdk';
import { OUTCOMES, type OutcomeLabel } from './outcomes';

export type ProbabilityState =
	| { status: 'idle' }
	| {
			status: 'success';
			statement: string;
			choice: OutcomeLabel;
			probabilities: Record<OutcomeLabel, number>;
			json: string;
	  }
	| { status: 'error'; message: string };

const MAX_STATEMENT_LENGTH = 200;

const CRITERIA = Object.fromEntries(OUTCOMES.map((o) => [o.label, o.description])) as Record<OutcomeLabel, string>;

const client = new TypeSafeClient({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api',
});

export async function rateStatement(_prevState: ProbabilityState, formData: FormData): Promise<ProbabilityState> {
	const statement = String(formData.get('statement') ?? '').trim();

	if (!statement) {
		return { status: 'error', message: 'Please enter a statement.' };
	}
	if (statement.length > MAX_STATEMENT_LENGTH) {
		return { status: 'error', message: `Please keep it under ${MAX_STATEMENT_LENGTH} characters.` };
	}

	try {
		const response = await client.systemOne({
			model: 'jev-1.13',
			state: statement,
			questions: {
				probability: choice('How probable is it that this statement will happen in the future?', CRITERIA),
			},
		});

		const answer = response.answers.probability;
		return {
			status: 'success',
			statement,
			choice: answer.choice,
			probabilities: { ...answer.probabilities },
			json: JSON.stringify(response, null, 2),
		};
	} catch (error) {
		console.error('Jev request failed:', error);
		return { status: 'error', message: 'The model request failed. Please try again.' };
	}
}

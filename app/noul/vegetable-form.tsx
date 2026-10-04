'use client';

import { useActionState } from 'react';
import { rateVegetable, type VegetableState } from './actions';

const initialState: VegetableState = { status: 'idle' };

export function VegetableForm() {
	const [state, formAction, pending] = useActionState(rateVegetable, initialState);

	return (
		<form action={formAction} className="flex w-full flex-col gap-4">
			<label htmlFor="word" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
				Type a word and press Enter
			</label>
			<input
				id="word"
				name="word"
				type="text"
				required
				maxLength={100}
				autoComplete="off"
				autoFocus
				disabled={pending}
				placeholder="e.g. carrot"
				className="h-12 rounded-lg border border-black/[.08] bg-white px-4 text-lg text-black outline-none focus:border-black/30 disabled:opacity-60 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white/40"
			/>
			<p aria-live="polite" className="min-h-8 text-2xl font-semibold text-black dark:text-zinc-50">
				{pending && <span className="text-zinc-500">Asking Jev…</span>}
				{!pending && state.status === 'success' && (
					<>
						&ldquo;{state.word}&rdquo; is {state.percent}% vegetable
					</>
				)}
				{!pending && state.status === 'error' && (
					<span className="text-base font-normal text-red-600">{state.message}</span>
				)}
			</p>
			{!pending && state.status === 'success' && (
				<details className="text-sm">
					<summary className="cursor-pointer text-zinc-600 dark:text-zinc-400">JSON response</summary>
					<pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
						{state.json}
					</pre>
				</details>
			)}
		</form>
	);
}

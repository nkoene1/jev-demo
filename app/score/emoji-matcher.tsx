'use client';

import { useActionState, ViewTransition } from 'react';
import { matchEmojis, type EmojiMatchState } from './actions';
import type { Emoji } from './emojis';

const initialState: EmojiMatchState = { status: 'idle' };

function EmojiTile({ emoji }: { emoji: Emoji }) {
	return (
		<ViewTransition name={`emoji-${emoji.slug}`}>
			<span title={emoji.name} className="inline-block text-3xl leading-none">
				{emoji.emoji}
			</span>
		</ViewTransition>
	);
}

export function EmojiMatcher({ emojis }: { emojis: Emoji[] }) {
	const [state, formAction, pending] = useActionState(matchEmojis, initialState);

	const matches = state.status === 'success' ? state.matches : [];
	const bySlug = new Map(emojis.map((e) => [e.slug, e]));
	const matchedSlugs = new Set(matches.map((m) => m.slug));
	const rest = emojis.filter((e) => !matchedSlugs.has(e.slug));

	return (
		<div className="flex w-full flex-col gap-6">
			<form action={formAction} className="flex flex-col gap-4">
				<label htmlFor="text" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
					Describe something and press Enter
				</label>
				<input
					id="text"
					name="text"
					type="text"
					required
					maxLength={200}
					autoComplete="off"
					autoFocus
					disabled={pending}
					placeholder="e.g. healthy food"
					className="h-12 rounded-lg border border-black/8 bg-white px-4 text-lg text-black outline-none focus:border-black/30 disabled:opacity-60 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white/40"
				/>
				<p aria-live="polite" className="min-h-6 text-sm">
					{pending && <span className="text-zinc-500">Asking Jev…</span>}
					{!pending && state.status === 'error' && <span className="text-red-600">{state.message}</span>}
				</p>
			</form>

			{matches.length > 0 && (
				<ul className="flex flex-wrap gap-4">
					{matches.map(({ slug, percent }) => {
						const emoji = bySlug.get(slug);
						if (!emoji) return null;
						return (
							<li key={slug} className="flex flex-col items-center gap-1">
								<EmojiTile emoji={emoji} />
								<span className="text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{percent}%</span>
							</li>
						);
					})}
				</ul>
			)}

			<ul className="flex flex-wrap gap-2 border-t border-black/8 pt-6 dark:border-white/[.145]">
				{rest.map((emoji) => (
					<li key={emoji.slug}>
						<EmojiTile emoji={emoji} />
					</li>
				))}
			</ul>

			{state.status === 'success' && (
				<details className="text-sm">
					<summary className="cursor-pointer text-zinc-600 dark:text-zinc-400">JSON response</summary>
					<pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
						{state.json}
					</pre>
				</details>
			)}
		</div>
	);
}

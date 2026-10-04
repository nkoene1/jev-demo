'use client';

import { useActionState } from 'react';
import { rateStatement, type ProbabilityState } from './actions';
import { OUTCOMES, type OutcomeLabel } from './outcomes';

const initialState: ProbabilityState = { status: 'idle' };

// Circumference of 100 lets dash lengths be expressed directly in percent.
const RADIUS = 100 / (2 * Math.PI);

function PieChart({ probabilities }: { probabilities: Record<OutcomeLabel, number> }) {
	let offset = 0;
	return (
		<svg
			viewBox={`0 0 ${RADIUS * 4} ${RADIUS * 4}`}
			className="size-48 shrink-0 -rotate-90"
			role="img"
			aria-label="Probability distribution"
		>
			{OUTCOMES.map(({ label, color }) => {
				const percent = probabilities[label] * 100;
				const slice = (
					<circle
						key={label}
						cx={RADIUS * 2}
						cy={RADIUS * 2}
						r={RADIUS}
						fill="none"
						stroke={color}
						strokeWidth={RADIUS * 2}
						strokeDasharray={`${percent} ${100 - percent}`}
						strokeDashoffset={-offset}
					>
						<title>{`${label}: ${percent.toFixed(1)}%`}</title>
					</circle>
				);
				offset += percent;
				return slice;
			})}
		</svg>
	);
}

export function ProbabilityForm() {
	const [state, formAction, pending] = useActionState(rateStatement, initialState);

	return (
		<div className="flex w-full flex-col gap-6">
			<form action={formAction} className="flex flex-col gap-4">
				<label htmlFor="statement" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
					Write a statement about the future and press Enter
				</label>
				<input
					id="statement"
					name="statement"
					type="text"
					required
					maxLength={200}
					autoComplete="off"
					autoFocus
					disabled={pending}
					placeholder="e.g. Humans land on Mars before 2040"
					className="h-12 rounded-lg border border-black/8 bg-white px-4 text-lg text-black outline-none focus:border-black/30 disabled:opacity-60 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white/40"
				/>
				<p aria-live="polite" className="min-h-8 text-2xl font-semibold text-black dark:text-zinc-50">
					{pending && <span className="text-zinc-500">Asking Jev…</span>}
					{!pending && state.status === 'success' && (
						<>
							&ldquo;{state.statement}&rdquo; is {state.choice}
						</>
					)}
					{!pending && state.status === 'error' && (
						<span className="text-base font-normal text-red-600">{state.message}</span>
					)}
				</p>
			</form>

			{!pending && state.status === 'success' && (
				<>
					<div className="flex flex-wrap items-center gap-8">
						<PieChart probabilities={state.probabilities} />
						<ul className="flex flex-col gap-2">
							{OUTCOMES.map(({ label, color }) => (
								<li key={label} className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
									<span className="size-3 rounded-sm" style={{ backgroundColor: color }} />
									<span className={`w-24 capitalize ${label === state.choice ? 'font-semibold' : ''}`}>{label}</span>
									<span className="tabular-nums text-zinc-600 dark:text-zinc-400">
										{(state.probabilities[label] * 100).toFixed(1)}%
									</span>
								</li>
							))}
						</ul>
					</div>
					<details className="text-sm">
						<summary className="cursor-pointer text-zinc-600 dark:text-zinc-400">JSON response</summary>
						<pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
							{state.json}
						</pre>
					</details>
				</>
			)}
		</div>
	);
}

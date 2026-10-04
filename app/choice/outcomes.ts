export const OUTCOMES = [
	{ label: 'impossible', description: 'It cannot happen', color: '#ef4444' },
	{ label: 'unlikely', description: 'It probably will not happen', color: '#f59e0b' },
	{ label: 'likely', description: 'It probably will happen', color: '#3b82f6' },
	{ label: 'certain', description: 'It will definitely happen', color: '#22c55e' },
] as const;

export type OutcomeLabel = (typeof OUTCOMES)[number]['label'];

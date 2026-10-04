import { ProbabilityForm } from './probability-form';

export default function ChoicePage() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex w-full max-w-xl flex-col gap-8 py-32 px-16">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
						How probable is it to happen?
					</h1>
					<p className="text-zinc-600 dark:text-zinc-400">
						Powered by TypeSafe AI&apos;s Jev 1.13 using a Choice question.
					</p>
				</div>
				<ProbabilityForm />
			</main>
		</div>
	);
}

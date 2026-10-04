import { EmojiMatcher } from './emoji-matcher';
import { EMOJIS } from './emojis';

export default function ScorePage() {
	return (
		<div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">Find the emoji</h1>
					<p className="text-zinc-600 dark:text-zinc-400">
						Powered by TypeSafe AI&apos;s Jev 1.13 using one Score question per emoji ({EMOJIS.length} in total).
					</p>
				</div>
				<EmojiMatcher emojis={EMOJIS} />
			</main>
		</div>
	);
}

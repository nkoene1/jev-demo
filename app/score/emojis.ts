import groups from 'unicode-emoji-json/data-by-group.json';

export type Emoji = { emoji: string; slug: string; name: string };

const GROUPS = ['food_drink', 'animals_nature'];
// Emoji 12.0 or older renders on most systems and keeps the list under Choice's 255-option limit.
const MAX_EMOJI_VERSION = 12;

export const EMOJIS: Emoji[] = groups
	.filter((group) => GROUPS.includes(group.slug))
	.flatMap((group) => group.emojis)
	.filter((e) => Number(e.emoji_version) <= MAX_EMOJI_VERSION)
	.map(({ emoji, slug, name }) => ({ emoji, slug, name }));

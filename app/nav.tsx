'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
	{ href: '/choice', label: 'Choice' },
	{ href: '/score', label: 'Score' },
	{ href: '/noul', label: 'Noul' },
] as const;

export function Nav() {
	const pathname = usePathname();

	return (
		<nav className="flex justify-center gap-2 border-b border-black/8 bg-white px-4 py-3 font-sans dark:border-white/[.145] dark:bg-black">
			{LINKS.map(({ href, label }) => {
				const active = pathname === href;
				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? 'page' : undefined}
						className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
							active
								? 'bg-black text-white dark:bg-white dark:text-black'
								: 'text-zinc-600 hover:bg-black/4 dark:text-zinc-400 dark:hover:bg-white/8'
						}`}
					>
						{label}
					</Link>
				);
			})}
		</nav>
	);
}

"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useTransition } from "react";

import { type Locale, usePathname, useRouter } from "@/i18n/routing";
import { setUserLocale } from "@/services/locale";

type Props = {
	children: ReactNode;
	defaultValue: string;
	label: string;
};

export default function LocaleSwitcherSelect({
	children,
	defaultValue,
	label,
}: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value as Locale;

		startTransition(async () => {
			await setUserLocale(nextLocale);
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale },
			);
		});
	}

	return (
		<label
			className={clsx(
				"relative text-gray-400 flex justify-center w-20 bg-white rounded-md",
				isPending && "transition-opacity disabled:opacity-30",
			)}
			htmlFor="locale-switcher"
		>
			<p className="sr-only">{label}</p>
			<select
				className="inline-flex appearance-none bg-transparent py-1 px-1 focus:outline-hidden"
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
				id="locale-switcher"
			>
				{children}
			</select>
		</label>
	);
}

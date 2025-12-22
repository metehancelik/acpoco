"use client";

import { useLocale, useTranslations } from "next-intl";

import LocaleSwitcherSelect from "./LocaleSwitcherWrapper";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
			<option key={"tr"} value={"tr"}>
				🇹🇷 TR
			</option>
			<option key={"en"} value={"en"}>
				🇺🇸 EN
			</option>
			<option key={"de"} value={"de"}>
				🇩🇪 DE
			</option>
		</LocaleSwitcherSelect>
	);
}

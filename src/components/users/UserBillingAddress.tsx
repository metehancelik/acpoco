"use client";

import { useTranslations } from "next-intl";

import type { IBillingAddress } from "@/app/[locale]/(admin)/users/[id]/page";

interface Props {
	billingAddress: IBillingAddress | undefined;
}

const UserBillingAddress: React.FC<Props> = ({ billingAddress }) => {
	const t = useTranslations("Billing");
	const tUserDetail = useTranslations("UserDetail");

	if (!billingAddress) {
		return (
			<p className="text-sm text-muted-foreground">
				{tUserDetail("noBillingAddress")}
			</p>
		);
	}

	const rows: { label: string; value: string | undefined }[] = [
		{ label: t("title"), value: billingAddress.title },
		{ label: t("firstName"), value: billingAddress.firstName },
		{ label: t("lastName"), value: billingAddress.lastName },
		{ label: t("companyName"), value: billingAddress.companyName },
		{
			label: tUserDetail("identityNumber"),
			value: billingAddress.identityNumber,
		},
		{ label: t("vatNumber"), value: billingAddress.vatNumber },
		{ label: tUserDetail("taxOffice"), value: billingAddress.taxOffice },
		{ label: t("gsmNumber"), value: billingAddress.gsmNumber },
		{ label: tUserDetail("addressLine1"), value: billingAddress.addressLine1 },
		{ label: t("addressLine2"), value: billingAddress.addressLine2 },
		{ label: t("city"), value: billingAddress.city },
		{ label: t("country"), value: billingAddress.country },
		{ label: t("zipCode"), value: billingAddress.zipCode },
	];

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{rows.map(({ label, value }) => (
				<div key={label} className="space-y-0.5">
					<p className="text-xs font-medium uppercase tracking-wider text-gray-500">
						{label}
					</p>
					<p className="text-sm text-gray-900">{value ?? "–"}</p>
				</div>
			))}
		</div>
	);
};

export default UserBillingAddress;

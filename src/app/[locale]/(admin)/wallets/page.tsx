"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";

import WalletItem from "@/components/wallets/WalletItem";
import AlertNotification from "@/utils/alertNotification";

export interface IWalletDeposit {
	_id: number;
	requestedAmount: number;
	requestedBy: { name: string; email: string };
	status: string;
	createdAt: string;
}
export default function Wallets() {
	const t = useTranslations("Wallets");
	const tCommon = useTranslations("Common");

	const {
		data: wallets = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["wallets"],
		queryFn: async () => {
			const res = await axios.get("/api/wallet");

			return res.data;
		},
		refetchOnMount: false,
	});

	if (error) {
		AlertNotification(t("errorOccurred"), "error");
		console.error(error);
	}

	return (
		<div className="flex flex-col">
			<div className="w-full flex text-center rounded-t-md border-b border-b-primary bg-gray-50 py-2 mb-2 text-text-primary font-bold">
				<p className="w-1/6">{t("name")}</p>
				<p className="w-1/6">{t("amount")}</p>
				<p className="w-1/6">{t("status")}</p>
				<p className="w-1/6">{t("date")}</p>
				<p className="w-1/6">{t("approve")}</p>
				<p className="w-1/6">{t("reject")}</p>
			</div>
			<div className="flex flex-col space-y-2">
				{isLoading ? (
					<div className="text-center py-4">{tCommon("loading")}</div>
				) : (
					wallets.map((item: IWalletDeposit) => {
						return <WalletItem key={item._id} item={item} />;
					})
				)}
			</div>
		</div>
	);
}

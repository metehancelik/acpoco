"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import AlertNotification from "@/utils/alertNotification";
import { formatDate } from "@/utils/formatDate";

import Pagination from "../shared/Pagination";

interface IWalletLog {
	_id: number;
	userId: { name: string };
	changeAmount: number;
	currentBalance: number;
	finalBalance: number;
	type: string;
	createdAt: string;
	info: string;
	changedBy: { name: string };
}
const WalletLogs = () => {
	const t = useTranslations("Wallet");
	const tCommon = useTranslations("Common");
	const [walletLogs, setWalletLogss] = useState<IWalletLog[] | null>([]);
	const [totalPages, setTotalPages] = useState<number>(0);
	useEffect(() => {
		const getWalletLogs = async () => {
			try {
				const res = await axios.get("/api/wallet/logs");
				setWalletLogss(res.data.logs);
				setTotalPages(res.data.totalPages);
			} catch (error: unknown) {
				AlertNotification(tCommon("loading"), "error");
				console.error(error);
			}
		};
		getWalletLogs();
	}, [tCommon]);

	return (
		<div className="bg-gray-50 p-4">
			<p className="font-bold text-primary mb-2">{t("walletTransactions")}</p>
			<div className="w-full flex text-center rounded-t-md border-b border-b-primary bg-gray-50 py-2 text-text-primary font-bold">
				<p className="w-1/6">{t("name")}</p>
				<p className="w-1/6">{t("amount")}</p>
				<p className="w-1/6">{t("type")}</p>
				<p className="w-1/6">{t("date")}</p>
				<p className="w-1/6">{t("info")}</p>
				<p className="w-1/6">{t("transactionOwner")}</p>
			</div>
			<div className="w-full flex flex-col text-center rounded-t-md bg-gray-50 text-sm">
				{walletLogs && walletLogs.length > 0 ? (
					walletLogs.map((item) => {
						return (
							<div key={item._id} className="w-full flex text-center py-2">
								<p className="w-1/6">{item.userId.name}</p>
								<p className="w-1/6">{item.changeAmount}</p>
								<p className="w-1/6">{item.type}</p>
								<p className="w-1/6">{formatDate(item.createdAt)}</p>
								<p className="w-1/6">{item.info}</p>
								<p className="w-1/6">{item.changedBy.name}</p>
							</div>
						);
					})
				) : (
					<p>{tCommon("loading")}</p>
				)}
			</div>
			<Pagination totalPages={totalPages} />
		</div>
	);
};

export default WalletLogs;

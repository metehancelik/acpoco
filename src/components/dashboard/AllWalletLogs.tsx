"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import AlertNotification from "@/utils/alertNotification";

import Pagination from "../shared/Pagination";

export interface IWalletLog {
	_id: string;
	changeAmount: number;
	currentBalance: number;
	finalBalance: string;
	createdAt: string;
	type: string;
	info: string;
	changedBy: { name: string; surname: string };
	userId: { name: string; surname: string };
}

const AllWalletLogs = () => {
	const t = useTranslations("Dashboard");
	const tMonths = useTranslations("Months");
	const tWallets = useTranslations("Wallets");
	const [walletLogs, setWalletLogs] = useState<IWalletLog[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const searchParams = useSearchParams();

	const formatDateLocalized = (dateString: string) => {
		const monthKeys = [
			"january",
			"february",
			"march",
			"april",
			"may",
			"june",
			"july",
			"august",
			"september",
			"october",
			"november",
			"december",
		] as const;

		const date = new Date(dateString);
		const day = date.getUTCDate().toString().padStart(2, "0");
		const month = tMonths(monthKeys[date.getUTCMonth()]);
		const year = date.getUTCFullYear();
		const hour = date.getUTCHours().toString().padStart(2, "0");
		const minute = date.getUTCMinutes().toString().padStart(2, "0");

		return `${day} ${month} ${year} - ${hour}:${minute}`;
	};

	useEffect(() => {
		const getWalletLogs = async () => {
			try {
				const res = await axios.get(
					`/api/wallet/logs?page=${searchParams?.get("page") || 1}`,
				);
				setWalletLogs(res.data.logs);
				setTotalPages(res.data.totalPages);
			} catch (error: unknown) {
				AlertNotification(t("errorOccurred"), "error");
				console.error(error);
			}
		};
		getWalletLogs();
	}, [searchParams, t]);

	return (
		<div className="flex flex-col w-full mt-12 h-[40vh] relative overflow-y-auto">
			<h2 className="text-2xl font-bold mb-4">{t("walletTransactions")}</h2>
			<div className="w-full flex text-center rounded-t-md border-b border-b-primary bg-gray-50 py-2 mb-2 text-text-primary font-bold text-sm sticky top-0">
				<p className="w-full">{t("nameSurname")}</p>
				<p className="w-full">{t("amount")}</p>
				<p className="w-full">{t("oldBalance")}</p>
				<p className="w-full">{t("newBalance")}</p>
				<p className="w-full">{t("date")}</p>
				<p className="w-full">{t("approvedBy")}</p>
				<p className="w-full">{t("info")}</p>
			</div>
			<div className="flex flex-col space-y-2">
				{walletLogs?.map((log) => (
					<div
						key={log._id}
						className="w-full flex items-center text-center bg-white rounded-md border border-gray-200 py-2"
					>
						<p className="w-full">
							{log.userId.name} {log.userId.surname}
						</p>
						<p className="w-full">{log.changeAmount}</p>
						<p className="w-full">{log.currentBalance}</p>
						<p className="w-full">{log.finalBalance}</p>
						<p className="w-full">{formatDateLocalized(log.createdAt)}</p>
						<p className="w-full">
							{log.changedBy.name} {log.changedBy.surname}
						</p>

						<p className="w-full">{log.info ? tWallets(log.info) : "-"}</p>
					</div>
				))}
			</div>

			<Pagination totalPages={totalPages} />
		</div>
	);
};

export default AllWalletLogs;

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
		<div className="flex flex-col w-full">
			<div className="overflow-x-auto">
				<div className="max-h-[45vh] overflow-y-auto">
					<table className="min-w-full">
						<thead className="bg-slate-50/80 sticky top-0 z-10">
							<tr>
								<th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("nameSurname")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("amount")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("oldBalance")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("newBalance")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("date")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("approvedBy")}
								</th>
								<th className="py-4 pl-3 pr-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									{t("info")}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{walletLogs?.map((log) => (
								<tr
									key={log._id}
									className="hover:bg-slate-50/50 transition-colors"
								>
									<td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
										{log.userId.name} {log.userId.surname}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-center text-sm">
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
												log.changeAmount >= 0
													? "bg-emerald-50 text-emerald-700"
													: "bg-red-50 text-red-700"
											}`}
										>
											{log.changeAmount >= 0 ? "+" : ""}
											{log.changeAmount}
										</span>
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
										€{log.currentBalance}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
										€{log.finalBalance}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
										{formatDateLocalized(log.createdAt)}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
										{log.changedBy.name} {log.changedBy.surname}
									</td>
									<td className="whitespace-nowrap py-4 pl-3 pr-6 text-sm">
										{log.info ? (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
												{tWallets(log.info)}
											</span>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="p-4 border-t bg-slate-50/50">
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
};

export default AllWalletLogs;

"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import AlertNotification from "@/utils/alertNotification";
import { formatDate } from "@/utils/formatDate";

import Pagination from "../shared/Pagination";

const formatEur = (value: number) =>
	new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
	}).format(value);

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
	const searchParams = useSearchParams();
	const page = searchParams?.get("page") || "1";
	const [walletLogs, setWalletLogss] = useState<IWalletLog[] | null>([]);
	const [totalPages, setTotalPages] = useState<number>(0);

	useEffect(() => {
		const getWalletLogs = async () => {
			try {
				const res = await axios.get(`/api/wallet/logs?page=${page}`);
				setWalletLogss(res.data.logs);
				setTotalPages(res.data.totalPages);
			} catch (error: unknown) {
				AlertNotification(tCommon("loading"), "error");
				console.error(error);
			}
		};
		getWalletLogs();
	}, [page, tCommon]);

	return (
		<div className="flex w-full flex-col">
			<div className="overflow-x-auto">
				<div className="max-h-[45vh] overflow-y-auto">
					<table className="min-w-full">
						<thead className="sticky top-0 z-10 bg-slate-50/80">
							<tr>
								<th className="px-3 py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("name")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("amount")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("type")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("date")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("info")}
								</th>
								<th className="py-4 pl-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("transactionOwner")}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{walletLogs && walletLogs.length > 0 ? (
								walletLogs.map((item) => (
									<tr
										key={item._id}
										className="transition-colors hover:bg-slate-50/50"
									>
										<td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
											{item.userId.name}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm">
											{(() => {
												const isCredit =
													item.finalBalance > item.currentBalance;
												return (
													<span
														className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
															isCredit
																? "bg-emerald-50 text-emerald-700"
																: "bg-red-50 text-red-700"
														}`}
													>
														{isCredit ? "+" : "−"}
														{formatEur(Math.abs(item.changeAmount))}
													</span>
												);
											})()}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-600">
											{item.type}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
											{formatDate(item.createdAt)}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
											{item.info || "–"}
										</td>
										<td className="whitespace-nowrap py-4 pl-3 pr-6 text-sm text-gray-600">
											{item.changedBy.name}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-8 text-center text-sm text-gray-500"
									>
										{tCommon("loading")}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{totalPages > 1 && (
				<div className="border-t bg-slate-50/50 p-4">
					<Pagination totalPages={totalPages} />
				</div>
			)}
		</div>
	);
};

export default WalletLogs;

"use client";

import { useTranslations } from "next-intl";

import { formatDate } from "@/utils/formatDate";

import Pagination from "../shared/Pagination";
import type { IWalletLog } from "./AllWalletLogs";

const formatEur = (value: number) =>
	new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
	}).format(value);

interface Props {
	walletLogs: IWalletLog[];
	totalPages: number;
}

const WalletLogsTable: React.FC<Props> = ({ walletLogs, totalPages }) => {
	const t = useTranslations("Dashboard");
	const tUserDetail = useTranslations("UserDetail");

	return (
		<div className="flex w-full flex-col">
			<div className="overflow-x-auto">
				<div className="max-h-[45vh] overflow-y-auto">
					<table className="min-w-full">
						<thead className="sticky top-0 z-10 bg-slate-50/80">
							<tr>
								<th className="px-3 py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("nameSurname")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("amount")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("oldBalance")}
								</th>
								<th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("newBalance")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("date")}
								</th>
								<th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("approvedBy")}
								</th>
								<th className="py-4 pl-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
									{t("info")}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{walletLogs?.length > 0 ? (
								walletLogs.map((log) => (
									<tr
										key={log._id}
										className="transition-colors hover:bg-slate-50/50"
									>
										<td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
											{log.userId.name} {log.userId.surname}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm">
											{(() => {
												const isCredit =
													Number(log.finalBalance) > log.currentBalance;
												return (
													<span
														className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
															isCredit
																? "bg-emerald-50 text-emerald-700"
																: "bg-red-50 text-red-700"
														}`}
													>
														{isCredit ? "+" : "−"}
														{formatEur(Math.abs(log.changeAmount))}
													</span>
												);
											})()}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
											{formatEur(log.currentBalance)}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
											{formatEur(Number(log.finalBalance))}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
											{formatDate(log.createdAt)}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
											{log.changedBy.name} {log.changedBy.surname}
										</td>
										<td className="whitespace-nowrap py-4 pl-3 pr-6 text-sm">
											{log.info ? (
												<span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
													{log.info}
												</span>
											) : (
												<span className="text-gray-400">–</span>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="px-4 py-8 text-center text-sm text-gray-500"
									>
										{tUserDetail("noTransactionsYet")}
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

export default WalletLogsTable;

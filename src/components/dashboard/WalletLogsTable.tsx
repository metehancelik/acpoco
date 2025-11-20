import type React from "react";

import { formatDate } from "@/utils/formatDate";

import Pagination from "../shared/Pagination";
import type { IWalletLog } from "./AllWalletLogs";

interface Props {
	walletLogs: IWalletLog[];
	totalPages: number;
}
const WalletLogsTable: React.FC<Props> = ({ walletLogs, totalPages }) => {
	return (
		<div className="flex flex-col w-full max-w-[1280px] mx-auto mt-12 h-[40vh] relative overflow-y-auto">
			<div className="w-full flex text-center rounded-t-md border-b border-b-primary bg-gray-50 py-2 mb-2 text-text-primary font-bold text-sm sticky top-0">
				<p className="w-full">İsim-Soyisim</p>
				<p className="w-full">Tutar</p>
				<p className="w-full">Eski Bakiye</p>
				<p className="w-full">Yeni Bakiye</p>
				<p className="w-full">Tarih</p>
				<p className="w-full">Onaylayan</p>
				<p className="w-full">Bilgi</p>
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
						<p className="w-full">{formatDate(log.createdAt)}</p>
						<p className="w-full">
							{log.changedBy.name} {log.changedBy.surname}
						</p>

						<p className="w-full">{log.info || "-"}</p>
					</div>
				))}
			</div>

			<Pagination totalPages={totalPages} />
		</div>
	);
};

export default WalletLogsTable;

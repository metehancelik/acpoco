import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type React from "react";

import AlertNotification from "@/utils/alertNotification";
import { classNames } from "@/utils/classNames";
import { formatDate } from "@/utils/formatDate";

interface IWalletDeposit {
	_id: number;
	requestedAmount: number;
	requestedBy: { name: string; email: string };
	status: string;
	createdAt: string;
}

interface WalletItemProps {
	item: IWalletDeposit;
}

const WalletItem: React.FC<WalletItemProps> = ({ item }) => {
	const queryClient = useQueryClient();

	const updateStatusMutation = useMutation({
		mutationFn: async (status: "APPROVED" | "REJECTED") => {
			await axios.put(`/api/wallet/${item._id}`, { status });
		},
		onSuccess: (_, status) => {
			const message =
				status === "APPROVED" ? "Talep onaylandı" : "Talep reddedildi";
			AlertNotification(message, "success");
			queryClient.invalidateQueries({ queryKey: ["wallets"] });
		},
		onError: (error) => {
			console.error(error);
			AlertNotification("Bir hata oluştu!", "error");
		},
	});

	const handleUpdateStatus = (status: "APPROVED" | "REJECTED") => {
		updateStatusMutation.mutate(status);
	};

	const refactorStatus = (status: string) => {
		if (status === "PENDING") {
			return "Beklemede";
		} else if (status === "APPROVED") {
			return "Onaylandı";
		} else if (status === "REJECTED") {
			return "Red";
		}
	};

	return (
		<div className="flex w-full items-center bg-lime-50 rounded-md border border-lime-100 py-2 text-text-primary">
			<div className="w-1/6 text-center">{item.requestedBy.name}</div>
			<div className="w-1/6 text-center">${item.requestedAmount}</div>
			<div className="w-1/6 text-center flex items-center justify-center space-x-2">
				<p> {refactorStatus(item.status)}</p>
				{item.status === "PENDING" && (
					<InformationCircleIcon
						className="animate-pulse"
						width={24}
						height={24}
						color="#F55E45"
					/>
				)}
			</div>
			<div className="w-1/6 text-center">{formatDate(item.createdAt)}</div>
			<div className="w-1/6 text-center">
				<button
					onClick={() => handleUpdateStatus("APPROVED")}
					disabled={updateStatusMutation.isPending || item.status !== "PENDING"}
					className="w-1/6 text-center text-green-600 hover:text-green-800 disabled:opacity-50 disabled:hover:text-green-600"
				>
					{updateStatusMutation.isPending ? "İşleniyor..." : "Onayla"}
				</button>
			</div>
			<div className="w-1/6 text-center">
				<button
					disabled={updateStatusMutation.isPending || item.status !== "PENDING"}
					onClick={() => handleUpdateStatus("REJECTED")}
					className={classNames(
						item.status === "PENDING" ? "bg-danger" : "bg-danger opacity-50",
						"px-2 text-white rounded-md py-1",
					)}
				>
					{updateStatusMutation.isPending ? "İşleniyor..." : "Reddet"}
				</button>
			</div>
		</div>
	);
};

export default WalletItem;

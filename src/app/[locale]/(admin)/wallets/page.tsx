"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
		AlertNotification("Bir hata oluştu!", "error");
		console.error(error);
	}

	return (
		<div className="flex flex-col">
			<div className="w-full flex text-center rounded-t-md border-b border-b-primary bg-gray-50 py-2 mb-2 text-text-primary font-bold">
				<p className="w-1/6">İsim</p>
				<p className="w-1/6">Tutar</p>
				<p className="w-1/6">Durum</p>
				<p className="w-1/6">Tarih</p>
				<p className="w-1/6">Onayla</p>
				<p className="w-1/6">Reddet</p>
			</div>
			<div className="flex flex-col space-y-2">
				{isLoading ? (
					<div className="text-center py-4">Yükleniyor...</div>
				) : (
					wallets.map((item: IWalletDeposit) => {
						return <WalletItem key={item._id} item={item} />;
					})
				)}
			</div>
		</div>
	);
}

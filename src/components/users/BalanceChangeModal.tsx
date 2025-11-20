import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import AlertNotification from "@/utils/alertNotification";

interface BalanceChangeModalProps {
	isOpen: boolean;
	userId: string;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BalanceChangeModal = ({
	isOpen,
	setIsModalOpen,
	userId,
}: BalanceChangeModalProps) => {
	const [type, setType] = useState("");
	const [amount, setAmount] = useState("");
	const [info, setInfo] = useState("");
	const queryClient = useQueryClient();

	const balanceChangeMutation = useMutation({
		mutationFn: async () => {
			const response = await axios.put(`/api/wallet/change-balance/${userId}`, {
				amount: Number(amount),
				info,
				type: type === "credit" ? "deposit" : "withdraw",
			});

			return response.data;
		},
		onSuccess: () => {
			AlertNotification("Bakiye başarıyla güncellendi", "success");
			setIsModalOpen(false);
			// Revalidate both user and wallet logs queries
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
			queryClient.invalidateQueries({ queryKey: ["userWallet", userId] });
			queryClient.invalidateQueries({ queryKey: ["walletLogs", userId] });
		},
		onError: (error) => {
			console.error("Balance change error:", error);
			AlertNotification("Bir hata oluştu", "error");
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		balanceChangeMutation.mutate();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsModalOpen(false)}
			className="relative z-50"
		>
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="mx-auto w-full max-w-md rounded bg-white p-6">
					<DialogTitle className="text-lg font-medium leading-6 text-gray-900 mb-4">
						Change Balance
					</DialogTitle>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="type"
								className="block text-sm font-medium text-gray-700"
							>
								İşlem Tipi
							</label>
							<select
								id="type"
								value={type}
								onChange={(e) => setType(e.target.value)}
								className="mt-1 block w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
								required
							>
								<option value="">Seçiniz</option>
								<option value="credit">Ekle</option>
								<option value="debit">Çıkar</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="amount"
								className="block text-sm font-medium text-gray-700"
							>
								Miktar
							</label>
							<input
								type="number"
								id="amount"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="mt-1 block w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="info"
								className="block text-sm font-medium text-gray-700"
							>
								Bilgi
							</label>
							<textarea
								id="info"
								value={info}
								placeholder="Değişiklik sebebini giriniz..."
								onChange={(e) => setInfo(e.target.value)}
								className="mt-1 block w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
								rows={3}
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								type="button"
								onClick={() => {
									setIsModalOpen(false);
								}}
								className="text-danger font-bold w-full px-4 py-2 text-sm border border-danger rounded-md bg-white hover:bg-primary hover:text-white"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={balanceChangeMutation.isPending}
								className="px-4 py-2 text-sm font-medium w-full text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
							>
								{balanceChangeMutation.isPending ? "İşleniyor..." : "Submit"}
							</button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

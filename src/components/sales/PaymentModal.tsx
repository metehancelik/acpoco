import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type React from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import AlertNotification from "@/utils/alertNotification";
import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";

interface Props {
	order: OrderWithPopulatedItems & { _id: string };
	onClose: () => void;
	open: boolean;
}

const PaymentModal: React.FC<Props> = ({ order, onClose, open }) => {
	const queryClient = useQueryClient();

	const { data: wallet } = useQuery({
		queryKey: ["wallet"],
		queryFn: () => httpClient.get("/wallet/user-wallet"),
	});

	const paymentMutation = useMutation({
		mutationFn: async () => {
			// Update user's wallet balance
			await httpClient.post(`/orders/payment`, {
				orderId: order._id,
			});

			return { success: true };
		},
		onSuccess: () => {
			// Revalidate orders and user data
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			AlertNotification("Ödeme başarıyla gerçekleşti", "success");
			onClose();
		},
		onError: (error) => {
			console.error("Payment error:", error);
			AlertNotification("Ödeme işlemi başarısız", "error");
		},
	});

	const handlePayment = () => {
		const totalAmount = order.items.reduce((acc, item) => {
			const price = item.matchedPrice || 0;
			const quantity = item.quantity || 0;

			return acc + price * quantity;
		}, 0);

		if (totalAmount > (wallet?.data?.balance || 0)) {
			AlertNotification("Yetersiz bakiye", "error");

			return;
		}

		paymentMutation.mutate();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Ödeme Yap</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<p>Siparişe ait ödeme yapılacak ürünler:</p>
				</DialogDescription>
				<div className="flex flex-col gap-2 h-[400px] overflow-y-auto font-semibold">
					<div className="flex gap-2 items-center w-full justify-between">
						<p className="w-full text-center">Ürün Fotoğrafı</p>
						<p className="w-full text-center">Ürün SKU</p>
						<p className="w-full text-center">Adet</p>
						<p className="w-full text-center">Fiyat</p>
					</div>
					{order.items.map((item) => (
						<div
							key={item.lineItemKey}
							className="flex gap-2 items-center w-full justify-between"
						>
							<div className="w-full flex justify-center">
								<Image
									src={item?.imageUrl || ""}
									alt={item.name}
									width={100}
									height={100}
									className="rounded-md"
								/>
							</div>
							<p className="w-full text-center">{item.sku}</p>
							<p className="w-full text-center">{item.quantity}</p>
							<p className="w-full text-center">
								${(item?.matchedPrice || 0) * item.quantity}
							</p>
						</div>
					))}
					<div className="flex gap-2 items-center w-full justify-between mt-4">
						<p className="w-full text-center">Ara Depo Fiyatı</p>
						<p className="w-full text-center"></p>
						<p className="w-full text-center"></p>
						<p className="w-full text-center">${order.warehousePrice}</p>
					</div>
				</div>
				<div className="w-full flex justify-between items-center">
					<p className="text-lg font-bold">
						Mevcut Bakiye: ${wallet?.data?.balance?.toFixed(2)}
					</p>
					<p className="text-lg text-sage-blue font-bold">
						Toplam Fiyat: $
						{order.items
							.reduce(
								(acc, item) => acc + (item?.matchedPrice || 0) * item.quantity,
								0,
							)
							.toFixed(2) + (order.warehousePrice?.toFixed(2) || 0)}
					</p>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="destructive" onClick={onClose}>
						İptal
					</Button>
					<Button onClick={handlePayment} disabled={paymentMutation.isPending}>
						{paymentMutation.isPending ? "İşleniyor..." : "Ödeme Yap"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentModal;

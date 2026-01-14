import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

import { Button } from "../ui/button";

interface Props {
	order: OrderWithPopulatedItems & { _id: string };
	onClose: () => void;
	open: boolean;
}

const PaymentModal: React.FC<Props> = ({ order, onClose, open }) => {
	const t = useTranslations("Orders");
	const tCommon = useTranslations("Common");
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
			AlertNotification(t("paymentSuccess"), "success");
			onClose();
		},
		onError: (error) => {
			console.error("Payment error:", error);
			AlertNotification(t("paymentFailed"), "error");
		},
	});

	const handlePayment = () => {
		const totalAmount = order.items.reduce((acc, item) => {
			const price = item.matchedPrice || 0;
			const quantity = item.quantity || 0;

			return acc + price * quantity;
		}, 0);

		if (totalAmount > (wallet?.data?.balance || 0)) {
			AlertNotification(t("insufficientBalance"), "error");

			return;
		}

		paymentMutation.mutate();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t("makePayment")}</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handlePayment();
					}}
				>
					<DialogDescription>
						<p>{t("productsToPayFor")}</p>
					</DialogDescription>
					<div className="flex flex-col gap-2 h-[400px] overflow-y-auto font-semibold">
						<div className="flex gap-2 items-center w-full justify-between">
							<p className="w-full text-center">{t("productPhoto")}</p>
							<p className="w-full text-center">{t("productSku")}</p>
							<p className="w-full text-center">{t("quantity")}</p>
							<p className="w-full text-center">{t("price")}</p>
						</div>
						{order.items.map((item) => (
							<div
								key={item.lineItemKey}
								className="flex gap-2 items-center w-full justify-between"
							>
								<div className="w-full flex justify-center">
									<Image
										src={normalizeImageSrc(item?.imageUrl || "")}
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
							<p className="w-full text-center">{t("warehousePrice")}</p>
							<p className="w-full text-center"></p>
							<p className="w-full text-center"></p>
							<p className="w-full text-center">${order.warehousePrice}</p>
						</div>
					</div>
					<div className="w-full flex justify-between items-center py-4">
						<p className="text-lg font-bold">
							{t("currentBalance")}: ${wallet?.data?.balance?.toFixed(2)}
						</p>
						<p className="text-lg text-sage-blue font-bold">
							{t("totalPrice")}:
							{(
								order.items.reduce(
									(acc, item) => acc + (item?.matchedPrice || 0) * item.quantity,
									0,
								) + (order.warehousePrice || 0)
							).toLocaleString("en-US", {
								style: "currency",
								currency: "USD",
							})}
						</p>
					</div>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="destructive" onClick={onClose}>
							{tCommon("cancel")}
						</Button>
						<Button type="submit" disabled={paymentMutation.isPending}>
							{paymentMutation.isPending
								? t("processingPayment")
								: t("makePayment")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentModal;

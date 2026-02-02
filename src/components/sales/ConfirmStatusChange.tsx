"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import AlertNotification from "@/utils/alertNotification";
import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type OrderData = OrderWithPopulatedItems & {
	_id: string;
	warehousePrice?: number;
	shippingAmount?: number;
	labelUrl?: string;
};

interface ConfirmStatusChangeProps {
	status: string;
	isAllSelected: boolean;
	orderIds?: string[];
	orders?: OrderData[];
	open: boolean;
	onClose: () => void;
}

type FeeFormValues = {
	warehousePrice: string;
	shippingAmount: string;
};

const ConfirmStatusChange = ({
	status,
	isAllSelected,
	orderIds,
	orders,
	open,
	onClose,
}: ConfirmStatusChangeProps) => {
	const t = useTranslations("Orders");
	const tCommon = useTranslations("Common");
	const queryClient = useQueryClient();

	// Find orders that are missing warehouse/shipping fees
	// Exclude orders with uploaded files (fees are locked / not required)
	const ordersWithMissingFees = useMemo(() => {
		if (status !== "shipped" || !orders || !orderIds) return [];
		const orderHasUploadedFile = (order: OrderData) =>
			Boolean(order.labelUrl) || order.items?.some((item) => Boolean(item.designUrl));
		return orders.filter(
			(order) =>
				orderIds.includes(order._id) &&
				!orderHasUploadedFile(order) &&
				(order.warehousePrice == null ||
					order.warehousePrice === 0 ||
					order.shippingAmount == null ||
					order.shippingAmount === 0),
		);
	}, [status, orders, orderIds]);

	const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
	const [showFeeForm, setShowFeeForm] = useState(false);

	const currentOrder = ordersWithMissingFees[currentOrderIndex];

	const form = useForm<FeeFormValues>({
		defaultValues: {
			warehousePrice: "",
			shippingAmount: "",
		},
	});

	// Reset form when current order changes
	useEffect(() => {
		if (currentOrder) {
			form.reset({
				warehousePrice: currentOrder.warehousePrice?.toString() || "",
				shippingAmount: currentOrder.shippingAmount?.toString() || "",
			});
		}
	}, [currentOrder, form]);

	// Check if we need to show fee form when dialog opens
	useEffect(() => {
		if (open && status === "shipped" && ordersWithMissingFees.length > 0) {
			setShowFeeForm(true);
			setCurrentOrderIndex(0);
		} else {
			setShowFeeForm(false);
			setCurrentOrderIndex(0);
		}
	}, [open, status, ordersWithMissingFees.length]);

	const getStatusLabel = (statusKey: string) => {
		switch (statusKey) {
			case "waitingProduction":
				return t("waitingProductionStatus");
			case "processing":
				return t("processingStatus");
			case "shipped":
				return t("shippedStatus");
			default:
				return statusKey;
		}
	};

	// Mutation to update order fees
	const updateFeesMutation = useMutation({
		mutationFn: async (data: FeeFormValues) => {
			await httpClient.patch(`/orders/shipping/${currentOrder._id}`, {
				warehousePrice: data.warehousePrice ? Number(data.warehousePrice) : null,
				shippingAmount: data.shippingAmount ? Number(data.shippingAmount) : null,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			// Move to next order or proceed with status change
			if (currentOrderIndex < ordersWithMissingFees.length - 1) {
				setCurrentOrderIndex((prev) => prev + 1);
				form.reset({
					warehousePrice: "",
					shippingAmount: "",
				});
			} else {
				// All fees entered, proceed with status change
				setShowFeeForm(false);
				statusMutation.mutate();
			}
		},
		onError: () => {
			AlertNotification(t("statusUpdateFailed"), "error");
		},
	});

	// Mutation to change status
	const statusMutation = useMutation({
		mutationFn: async () => {
			const response = await httpClient.patch("/orders/supplier", {
				orderIds,
				changedStatus: status,
				isAllSelected,
				query: isAllSelected,
			});

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			AlertNotification(t("statusUpdated"), "success");
			handleClose();
		},
		onError: () => {
			AlertNotification(t("statusUpdateFailed"), "error");
		},
	});

	const handleClose = () => {
		setShowFeeForm(false);
		setCurrentOrderIndex(0);
		form.reset();
		onClose();
	};

	const onSubmitFees = (data: FeeFormValues) => {
		// Validate that both fields have values
		if (!data.warehousePrice || !data.shippingAmount) {
			AlertNotification(t("feesRequired"), "error");
			return;
		}
		updateFeesMutation.mutate(data);
	};

	const handleConfirm = () => {
		if (status === "shipped" && ordersWithMissingFees.length > 0) {
			setShowFeeForm(true);
		} else {
			statusMutation.mutate();
		}
	};

	// Show fee entry form
	if (showFeeForm && currentOrder) {
		return (
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>{t("enterFeesBeforeShipping")}</DialogTitle>
						<DialogDescription>
							<p className="mb-2">
								{t("orderMissingFees", {
									current: currentOrderIndex + 1,
									total: ordersWithMissingFees.length,
								})}
							</p>
							<p className="text-sm font-medium">
								{t("orderNo")}: #{currentOrder.orderId}
							</p>
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={form.handleSubmit(onSubmitFees)} className="space-y-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="warehousePrice">{t("warehouseCost")} *</Label>
							<Input
								id="warehousePrice"
								type="number"
								step="0.01"
								min="0"
								placeholder={t("enterWarehouseCost")}
								{...form.register("warehousePrice", {
									required: true,
								})}
							/>
							{form.formState.errors.warehousePrice && (
								<span className="text-sm text-red-500">
									{t("warehouseCostRequired")}
								</span>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="shippingAmount">{t("shippingCost")} *</Label>
							<Input
								id="shippingAmount"
								type="number"
								step="0.01"
								min="0"
								placeholder={t("enterShippingCost")}
								{...form.register("shippingAmount", {
									required: true,
								})}
							/>
							{form.formState.errors.shippingAmount && (
								<span className="text-sm text-red-500">
									{t("shippingCostRequired")}
								</span>
							)}
						</div>

						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={handleClose}>
								{tCommon("cancel")}
							</Button>
							<Button
								type="submit"
								disabled={updateFeesMutation.isPending || statusMutation.isPending}
							>
								{updateFeesMutation.isPending
									? tCommon("saving")
									: currentOrderIndex < ordersWithMissingFees.length - 1
										? t("nextOrder")
										: t("saveAndChangeStatus")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>{t("statusChange")}</DialogTitle>
					<DialogDescription>
						<p>
							{isAllSelected
								? t("allOrdersStatus")
								: t("selectedOrdersStatus", { count: orderIds?.length })}
						</p>
						<p>
							{getStatusLabel(status)} {t("confirmStatusChange")}
						</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						className="bg-danger text-white"
						onClick={handleClose}
					>
						{t("close")}
					</Button>
					<Button
						className="bg-primary text-white"
						onClick={handleConfirm}
						disabled={statusMutation.isPending}
					>
						{statusMutation.isPending ? tCommon("saving") : t("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmStatusChange;

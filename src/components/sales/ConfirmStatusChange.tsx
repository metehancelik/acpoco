"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

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

interface ConfirmStatusChangeProps {
	status: string;
	isAllSelected: boolean;
	orderIds?: string[];
	open: boolean;
	onClose: () => void;
}

const ConfirmStatusChange = ({
	status,
	isAllSelected,
	orderIds,
	open,
	onClose,
}: ConfirmStatusChangeProps) => {
	const t = useTranslations("Orders");
	const queryClient = useQueryClient();

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

	const mutation = useMutation({
		mutationFn: async () => {
			const response = await httpClient.patch("/orders/supplier", {
				orderIds,
				changedStatus: status,
				isAllSelected,
				query: isAllSelected, // if using query for all selected case
			});

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] }); // to refresh orders list
			AlertNotification(t("statusUpdated"), "success");
			onClose();
		},
		onError: () => {
			AlertNotification(t("statusUpdateFailed"), "error");
		},
	});

	return (
		<Dialog open={open} onOpenChange={onClose}>
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
						onClick={onClose}
					>
						{t("close")}
					</Button>
					<Button
						className="bg-primary text-white"
						onClick={() => mutation.mutate()}
					>
						{t("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmStatusChange;

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type React from "react";
import { useForm } from "react-hook-form";

import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
	isWarehouseModalOpen: boolean;
	setIsWarehouseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	order: OrderWithPopulatedItems & { _id: string };
}

type FormValues = {
	trackingNumber: string;
	shippingService: string;
};

const WarehouseModal: React.FC<Props> = ({
	isWarehouseModalOpen,
	setIsWarehouseModalOpen,
	order,
}) => {
	const t = useTranslations("Orders");
	const tCommon = useTranslations("Common");
	const form = useForm<FormValues>({
		defaultValues: {
			trackingNumber: "",
			shippingService: "",
		},
	});

	const queryClient = useQueryClient();

	const updateOrder = async (data: FormValues) => {
		await httpClient.patch(`/orders/shipping/${order._id}`, {
			trackingNumber: data.trackingNumber,
			shippingService: data.shippingService,
		});
	};

	const mutation = useMutation({
		mutationFn: updateOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			setIsWarehouseModalOpen(false);
			form.reset();
		},
	});

	const onSubmit = (data: FormValues) => {
		mutation.mutate(data);
	};

	const handleClose = () => {
		setIsWarehouseModalOpen(false);
		form.reset();
	};

	return (
		<Dialog open={isWarehouseModalOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("shippingInfo")}</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="trackingNumber">{t("trackingNumber")}</Label>
						<Input
							id="trackingNumber"
							placeholder={t("enterTrackingNumber")}
							{...form.register("trackingNumber", {
								required: t("trackingNumberRequired"),
							})}
						/>
						{form.formState.errors.trackingNumber && (
							<span className="text-sm text-red-500">
								{form.formState.errors.trackingNumber.message}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="shippingService">{t("shippingService")}</Label>
						<Input
							id="shippingService"
							placeholder={t("enterShippingService")}
							{...form.register("shippingService", {
								required: t("shippingServiceRequired"),
							})}
						/>
						{form.formState.errors.shippingService && (
							<span className="text-sm text-red-500">
								{form.formState.errors.shippingService.message}
							</span>
						)}
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button type="button" variant="outline" onClick={handleClose}>
							{tCommon("cancel")}
						</Button>
						<Button type="submit" size="lg" disabled={mutation.isPending}>
							{mutation.isPending ? tCommon("saving") : tCommon("save")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default WarehouseModal;

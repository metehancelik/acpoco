"use client";

import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import httpClient from "@/utils/httpClient";

export type UnifiedDiscountItem = {
	_id: string; // ID of the selectable item (variant ID for cart, product ID for favorites)
	title?: string; // Fallback title
	price: number;
	count: number;
	productId?:
		| string
		| {
				_id: string;
				title?: string;
				parentSku?: string;
		  }; // The product object or ID
	childSku?: string;
	variantId?: string;
};

interface DiscountRequestModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedItems: UnifiedDiscountItem[];
	onSuccess: () => void;
}

const DiscountRequestModal: React.FC<DiscountRequestModalProps> = ({
	isOpen,
	onClose,
	selectedItems,
	onSuccess,
}) => {
	const t = useTranslations("DiscountRequest");
	const tCommon = useTranslations("Common");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (selectedItems.length === 0) return;

		setIsSubmitting(true);
		try {
			const items = selectedItems.map((item) => {
				const prodId =
					(typeof item.productId === "object"
						? item.productId?._id
						: item.productId) || item._id;
				const varId = item.variantId || (item.childSku ? item._id : undefined);

				return {
					variantId: varId,
					productId: prodId,
					quantity: item.count || 1,
				};
			});

			await httpClient.post("/discount-requests", {
				items,
				message,
			});

			toast.success(t("requestSuccess"));
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error submitting discount request:", error);
			toast.error(t("requestError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<div className="py-4">
						<p className="text-sm text-gray-500 mb-4">
							{t("selectedProductsInfo", { count: selectedItems.length })}
						</p>
						<div className="max-h-40 overflow-y-auto mb-4 border rounded-md p-2">
							{selectedItems.map((item) => {
								const displayTitle =
									item.title ||
									(typeof item.productId === "object"
										? item.productId?.title
										: undefined) ||
									t("unknownProduct");
								const displaySku =
									item.childSku ||
									(typeof item.productId === "object"
										? item.productId?.parentSku
										: undefined);
								return (
									<div
										key={item._id}
										className="text-xs py-1 border-b last:border-0 flex justify-between"
									>
										<span>
											{displayTitle} {displaySku ? `(${displaySku})` : ""}
										</span>
										<span className="font-semibold">
											{t("quantity", { count: item.count || 1 })}
										</span>
									</div>
								);
							})}
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="message" className="text-sm font-medium">
								{t("noteLabel")}
							</label>
							<textarea
								id="message"
								className="w-full min-h-[100px] p-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sage-blue"
								placeholder={t("notePlaceholder")}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
						>
							{tCommon("cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-sage-blue hover:bg-indigo-400"
						>
							{isSubmitting ? t("sending") : t("sendRequest")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default DiscountRequestModal;

"use client";

import { ChevronDown, ChevronRight, Folder, Tag, User } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { IDiscountRequestPopulated } from "@/models/DiscountRequest";
import httpClient from "@/utils/httpClient";

interface DiscountApprovalModalProps {
	isOpen: boolean;
	onClose: () => void;
	request: IDiscountRequestPopulated | null;
	onSuccess: () => void;
}

const DiscountApprovalModal: React.FC<DiscountApprovalModalProps> = ({
	isOpen,
	onClose,
	request,
	onSuccess,
}) => {
	const t = useTranslations("DiscountAdmin");
	const [percentage, setPercentage] = useState<number>(10);
	const [adminNotes, setAdminNotes] = useState("");
	const [activeScope, setActiveScope] = useState<
		"user" | "category" | "product"
	>("user");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedProductId, setSelectedProductId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Default selections based on request
	React.useEffect(() => {
		if (request?.items && request.items.length > 0) {
			const firstItem = request.items[0];
			const cat = firstItem.productId.category;
			setSelectedCategoryId(typeof cat === "string" ? cat : cat?._id || "");
			setSelectedProductId(firstItem.productId?._id || "");
		}
	}, [request]);

	const handleApprove = async () => {
		if (!request) return;
		setIsSubmitting(true);
		try {
			await httpClient.put(`/discount-requests/${request._id}`, {
				status: "approved",
				percentage,
				adminNotes,
				scopeType: activeScope,
				categoryId: activeScope === "category" ? selectedCategoryId : undefined,
				productId: activeScope === "product" ? selectedProductId : undefined,
			});

			toast.success(t("approveSuccess"));
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error approving request:", error);
			toast.error(t("approveError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReject = async () => {
		if (!request) return;
		setIsSubmitting(true);
		try {
			await httpClient.put(`/discount-requests/${request._id}`, {
				status: "rejected",
				adminNotes,
			});

			toast.success(t("rejectSuccess"));
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error rejecting request:", error);
			toast.error(t("rejectError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!request) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("modalTitle")}</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleApprove();
					}}
				>
					<div className="py-4 space-y-6">
						{/* Request Info */}
						<div className="bg-blue-50 p-3 rounded-md text-sm">
							<p className="font-semibold text-blue-800">
								{t("modalUser")} {request.userId?.name}{" "}
								{request.userId?.surname}
							</p>
							<p className="text-blue-700">
								{t("modalMessage")} {request.message || t("noMessage")}
							</p>
						</div>

						{/* Percentage Input */}
						<div className="flex flex-col gap-2">
							<label
								htmlFor="discount-percentage"
								className="text-sm font-medium"
							>
								{t("percentageLabel")}
							</label>
							<input
								id="discount-percentage"
								type="number"
								min="1"
								max="100"
								value={percentage}
								onChange={(e) => setPercentage(Number(e.target.value))}
								className="w-full p-2 border rounded-md"
							/>
						</div>

						{/* Scope Accordion */}
						<div className="space-y-2">
							<label htmlFor="scope-accordion" className="text-sm font-medium">
								{t("scopeLabel")}
							</label>

							{/* User Level */}
							<div
								id="scope-accordion"
								className={`border rounded-md overflow-hidden ${activeScope === "user" ? "ring-1 ring-sage-blue" : ""}`}
							>
								<button
									type="button"
									onClick={() => setActiveScope("user")}
									className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-2">
										<User
											size={18}
											className={
												activeScope === "user"
													? "text-sage-blue"
													: "text-gray-400"
											}
										/>
										<span
											className={`text-sm ${activeScope === "user" ? "font-bold text-sage-blue" : "font-medium"}`}
										>
											{t("scopeUser")}
										</span>
									</div>
									{activeScope === "user" ? (
										<ChevronDown size={18} />
									) : (
										<ChevronRight size={18} />
									)}
								</button>
								{activeScope === "user" && (
									<div className="p-3 text-xs text-gray-600 border-t bg-white">
										{t.rich("scopeUserDescription", {
											b: (chunks) => <b>{chunks}</b>,
										})}
									</div>
								)}
							</div>

							{/* Category Level */}
							<div
								className={`border rounded-md overflow-hidden ${activeScope === "category" ? "ring-1 ring-sage-blue" : ""}`}
							>
								<button
									type="button"
									onClick={() => setActiveScope("category")}
									className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-2">
										<Folder
											size={18}
											className={
												activeScope === "category"
													? "text-sage-blue"
													: "text-gray-400"
											}
										/>
										<span
											className={`text-sm ${activeScope === "category" ? "font-bold text-sage-blue" : "font-medium"}`}
										>
											{t("scopeCategory")}
										</span>
									</div>
									{activeScope === "category" ? (
										<ChevronDown size={18} />
									) : (
										<ChevronRight size={18} />
									)}
								</button>
								{activeScope === "category" && (
									<div className="p-3 space-y-3 border-t bg-white">
										<p className="text-xs text-gray-600">
											{t("scopeCategoryDescription")}
										</p>
										<select
											value={selectedCategoryId}
											onChange={(e) => setSelectedCategoryId(e.target.value)}
											className="w-full p-2 border rounded-md text-sm"
										>
											<option value="">{t("selectCategory")}</option>
											{/* Unique categories from request items */}
											{Array.from(
												new Set(
													(request.items || [])
														.map((item) => {
															const cat = item.productId?.category;
															return typeof cat === "string" ? cat : cat?._id;
														})
														.filter(Boolean) as string[],
												),
											).map((catId: string) => {
												const matchingItem = request.items.find((item) => {
													const cat = item.productId?.category;
													const id = typeof cat === "string" ? cat : cat?._id;
													return id === catId;
												});
												const catName =
													typeof matchingItem?.productId?.category === "object"
														? matchingItem?.productId?.category?.name
														: undefined;
												return (
													<option key={catId} value={catId}>
														{catName || t("categoryInRequest", { id: catId })}
													</option>
												);
											})}
										</select>
									</div>
								)}
							</div>

							{/* Product Level */}
							<div
								className={`border rounded-md overflow-hidden ${activeScope === "product" ? "ring-1 ring-sage-blue" : ""}`}
							>
								<button
									type="button"
									onClick={() => setActiveScope("product")}
									className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-2">
										<Tag
											size={18}
											className={
												activeScope === "product"
													? "text-sage-blue"
													: "text-gray-400"
											}
										/>
										<span
											className={`text-sm ${activeScope === "product" ? "font-bold text-sage-blue" : "font-medium"}`}
										>
											{t("scopeProduct")}
										</span>
									</div>
									{activeScope === "product" ? (
										<ChevronDown size={18} />
									) : (
										<ChevronRight size={18} />
									)}
								</button>
								{activeScope === "product" && (
									<div className="p-3 space-y-3 border-t bg-white">
										<p className="text-xs text-gray-600">
											{t("scopeProductDescription")}
										</p>
										<select
											value={selectedProductId}
											onChange={(e) => setSelectedProductId(e.target.value)}
											className="w-full p-2 border rounded-md text-sm"
										>
											<option value="">{t("selectProduct")}</option>
											{request.items.map((item, idx: number) => {
												const prodId = item.productId?._id || "";
												return (
													<option key={prodId || `item-${idx}`} value={prodId}>
														{item.productId?.title}
													</option>
												);
											})}
										</select>
									</div>
								)}
							</div>
						</div>

						{/* Admin Notes */}
						<div className="flex flex-col gap-2">
							<label htmlFor="admin-notes" className="text-sm font-medium">
								{t("adminNotesLabel")}
							</label>
							<textarea
								id="admin-notes"
								value={adminNotes}
								onChange={(e) => setAdminNotes(e.target.value)}
								className="w-full min-h-[80px] p-2 border rounded-md text-sm"
								placeholder={t("adminNotesPlaceholder")}
							/>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={handleReject}
							disabled={isSubmitting}
							className="text-red-600 hover:text-red-700 hover:bg-red-50"
						>
							{t("reject")}
						</Button>
						<Button
							type="submit"
							disabled={
								isSubmitting ||
								(activeScope === "category" && !selectedCategoryId) ||
								(activeScope === "product" && !selectedProductId)
							}
							className="bg-sage-blue hover:bg-indigo-400"
						>
							{isSubmitting ? t("processing") : t("approve")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default DiscountApprovalModal;

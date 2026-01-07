"use client";

import { ChevronDown, ChevronRight, Folder, Tag, User } from "lucide-react";
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
	const [percentage, setPercentage] = useState<number>(10);
	const [adminNotes, setAdminNotes] = useState("");
	const [activeScope, setActiveScope] = useState<
		"user" | "category" | "variant"
	>("user");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedVariantId, setSelectedVariantId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Default selections based on request
	React.useEffect(() => {
		if (request?.items && request.items.length > 0) {
			const firstItem = request.items[0];
			const cat = firstItem.productId.category;
			setSelectedCategoryId(typeof cat === "string" ? cat : cat?._id || "");
			setSelectedVariantId(firstItem.variantId?._id || "");
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
				variantId: activeScope === "variant" ? selectedVariantId : undefined,
			});

			toast.success("İndirim talebi onaylandı ve indirim tanımlandı.");
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error approving request:", error);
			toast.error("Talep onaylanırken bir hata oluştu.");
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

			toast.success("İndirim talebi reddedildi.");
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Error rejecting request:", error);
			toast.error("Talep reddedilirken bir hata oluştu.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!request) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>İndirim Talebini Yönet</DialogTitle>
				</DialogHeader>

				<div className="py-4 space-y-6">
					{/* Request Info */}
					<div className="bg-blue-50 p-3 rounded-md text-sm">
						<p className="font-semibold text-blue-800">
							Kullanıcı: {request.userId?.name} {request.userId?.surname}
						</p>
						<p className="text-blue-700">
							Talep Mesajı: {request.message || "Yok"}
						</p>
					</div>

					{/* Percentage Input */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="discount-percentage"
							className="text-sm font-medium"
						>
							İndirim Oranı (%)
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
							İndirim Kapsamı
						</label>

						{/* User Level */}
						<div
							id="scope-accordion"
							className={`border rounded-md overflow-hidden ${activeScope === "user" ? "ring-1 ring-sage-blue" : ""}`}
						>
							<button
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
										Kullanıcı Bazlı İndirim
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
									Bu indirim kullanıcının sepetteki <b>TÜM</b> ürünlerine
									uygulanacaktır.
								</div>
							)}
						</div>

						{/* Category Level */}
						<div
							className={`border rounded-md overflow-hidden ${activeScope === "category" ? "ring-1 ring-sage-blue" : ""}`}
						>
							<button
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
										Kategori Bazlı İndirim
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
										Bu indirim seçili kategorideki tüm ürünlere uygulanacaktır.
									</p>
									<select
										value={selectedCategoryId}
										onChange={(e) => setSelectedCategoryId(e.target.value)}
										className="w-full p-2 border rounded-md text-sm"
									>
										<option value="">Kategori Seçin</option>
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
											return (
												<option key={catId} value={catId}>
													Bu Talepteki Kategori ({catId})
												</option>
											);
										})}
									</select>
								</div>
							)}
						</div>

						{/* Variant Level */}
						<div
							className={`border rounded-md overflow-hidden ${activeScope === "variant" ? "ring-1 ring-sage-blue" : ""}`}
						>
							<button
								onClick={() => setActiveScope("variant")}
								className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-2">
									<Tag
										size={18}
										className={
											activeScope === "variant"
												? "text-sage-blue"
												: "text-gray-400"
										}
									/>
									<span
										className={`text-sm ${activeScope === "variant" ? "font-bold text-sage-blue" : "font-medium"}`}
									>
										Varyant Bazlı İndirim
									</span>
								</div>
								{activeScope === "variant" ? (
									<ChevronDown size={18} />
								) : (
									<ChevronRight size={18} />
								)}
							</button>
							{activeScope === "variant" && (
								<div className="p-3 space-y-3 border-t bg-white">
									<p className="text-xs text-gray-600">
										Bu indirim sadece seçili ürün varyantına uygulanacaktır.
									</p>
									<select
										value={selectedVariantId}
										onChange={(e) => setSelectedVariantId(e.target.value)}
										className="w-full p-2 border rounded-md text-sm"
									>
										<option value="">Varyant Seçin</option>
										{request.items.map((item, idx: number) => {
											const varId = item.variantId?._id || "";
											const displaySku =
												item.variantId?.childSku || "Varyant Bilinmiyor";
											return (
												<option key={varId || `item-${idx}`} value={varId}>
													{item.productId?.title} - {displaySku}
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
							Yönetici Notu
						</label>
						<textarea
							id="admin-notes"
							value={adminNotes}
							onChange={(e) => setAdminNotes(e.target.value)}
							className="w-full min-h-[80px] p-2 border rounded-md text-sm"
							placeholder="Onay veya ret sebebi..."
						/>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={handleReject}
						disabled={isSubmitting}
						className="text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						Reddet
					</Button>
					<Button
						onClick={handleApprove}
						disabled={
							isSubmitting ||
							(activeScope === "category" && !selectedCategoryId) ||
							(activeScope === "variant" && !selectedVariantId)
						}
						className="bg-sage-blue hover:bg-indigo-400"
					>
						{isSubmitting ? "İşleniyor..." : "Onayla ve Tanımla"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DiscountApprovalModal;

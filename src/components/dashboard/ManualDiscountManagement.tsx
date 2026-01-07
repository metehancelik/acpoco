"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ChevronDown,
	ChevronRight,
	Folder,
	Tag,
	Trash2,
	User,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import type { IDiscount } from "@/models/Discount";
import httpClient from "@/utils/httpClient";

interface IDiscountPopulated extends Omit<IDiscount, "scope"> {
	scope: {
		type: "user" | "category" | "variant";
		userId?: string;
		categoryId?: string;
		variantId?: string;
	};
}

interface ManualDiscountManagementProps {
	userId: string;
}

const ManualDiscountManagement: React.FC<ManualDiscountManagementProps> = ({
	userId,
}) => {
	const queryClient = useQueryClient();
	const [percentage, setPercentage] = useState<number>(10);
	const [activeScope, setActiveScope] = useState<
		"user" | "category" | "variant"
	>("user");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedVariantId, setSelectedVariantId] = useState("");
	const [productQuery, setProductQuery] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch Categories
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await httpClient.get("/categories");
			return res.data;
		},
	});

	// Fetch Products for Variant Search
	const { data: productSearchData } = useQuery({
		queryKey: ["productSearch", productQuery],
		queryFn: async () => {
			if (productQuery.length < 2) return { products: [] };
			const res = await httpClient.get(
				`/products?query=${productQuery}&limit=10`,
			);
			return res.data;
		},
		enabled: productQuery.length >= 2,
	});

	// Fetch Active Discounts for this User
	const { data: userDiscounts } = useQuery({
		queryKey: ["user-discounts-admin", userId],
		queryFn: async () => {
			const res = await httpClient.get(`/discounts?userId=${userId}`);
			return res.data;
		},
	});

	const handleCreateDiscount = async () => {
		if (activeScope === "category" && !selectedCategoryId) {
			toast.error("Lütfen bir kategori seçin.");
			return;
		}
		if (activeScope === "variant" && !selectedVariantId) {
			toast.error("Lütfen bir varyant seçin.");
			return;
		}

		setIsSubmitting(true);
		try {
			await httpClient.post("/discounts", {
				percentage,
				scopeType: activeScope,
				userId,
				categoryId: activeScope === "category" ? selectedCategoryId : undefined,
				variantId: activeScope === "variant" ? selectedVariantId : undefined,
			});

			toast.success("İndirim başarıyla tanımlandı.");
			queryClient.invalidateQueries({
				queryKey: ["user-discounts-admin", userId],
			});
			// Reset form
			setPercentage(10);
		} catch (error) {
			console.error("Error creating discount:", error);
			toast.error("İndirim tanımlanırken bir hata oluştu.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeactivateDiscount = async (discountId: string) => {
		try {
			// We should have a way to deactivate, currently I'll just delete or update isActive
			// Let's assume we can DELETE it for now or implement a PATCH
			await httpClient.delete(`/discounts/${discountId}`);
			toast.success("İndirim kaldırıldı.");
			queryClient.invalidateQueries({
				queryKey: ["user-discounts-admin", userId],
			});
		} catch (error) {
			console.error("Error deleting discount:", error);
			toast.error("İndirim kaldırılırken bir hata oluştu.");
		}
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
			<h3 className="text-lg font-bold text-gray-900 border-b pb-4">
				İndirim Yönetimi
			</h3>

			{/* Active Discounts List */}
			<div className="space-y-4">
				<h4 className="text-sm font-semibold text-gray-700">
					Aktif İndirimler
				</h4>
				{userDiscounts && userDiscounts.length > 0 ? (
					<div className="grid grid-cols-1 gap-2">
						{userDiscounts.map((discount: IDiscountPopulated) => (
							<div
								key={discount._id}
								className="flex items-center justify-between p-3 bg-gray-50 border rounded-md text-sm"
							>
								<div className="flex items-center gap-3">
									<div className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">
										%{discount.percentage}
									</div>
									<div>
										<span className="capitalize font-medium text-gray-700">
											{discount.scope.type}
										</span>
										{discount.scope.categoryId && (
											<span className="text-gray-500 ml-1">
												{" "}
												(Kat: {discount.scope.categoryId})
											</span>
										)}
										{discount.scope.variantId && (
											<span className="text-gray-500 ml-1">
												{" "}
												(Var: {discount.scope.variantId})
											</span>
										)}
									</div>
								</div>
								<button
									onClick={() => handleDeactivateDiscount(discount._id)}
									className="text-red-500 hover:text-red-700 p-1"
									title="İndirimi Kaldır"
								>
									<Trash2 size={16} />
								</button>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-gray-500 italic">
						Bu kullanıcı için aktif özel indirim bulunmuyor.
					</p>
				)}
			</div>

			<div className="border-t pt-6 space-y-4">
				<h4 className="text-sm font-semibold text-gray-700">
					Yeni İndirim Tanımla
				</h4>

				{/* Percentage Input */}
				<div className="flex flex-col gap-2">
					<label
						htmlFor="manual-discount-percentage"
						className="text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						İndirim Oranı (%)
					</label>
					<input
						id="manual-discount-percentage"
						type="number"
						min="1"
						max="100"
						value={percentage}
						onChange={(e) => setPercentage(Number(e.target.value))}
						className="w-full p-2 border rounded-md focus:ring-2 focus:ring-sage-blue focus:border-transparent outline-none transition-all"
					/>
				</div>

				{/* Scope Selection Accordions */}
				<div className="space-y-3">
					<label
						htmlFor="scope-selector"
						className="text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						İndirim Kapsamı
					</label>

					{/* User Scope */}
					<div
						className={`border rounded-lg overflow-hidden transition-all ${activeScope === "user" ? "ring-2 ring-sage-blue border-transparent" : "hover:border-gray-300"}`}
					>
						<button
							onClick={() => setActiveScope("user")}
							className={`w-full flex items-center justify-between p-4 transition-colors ${activeScope === "user" ? "bg-blue-50/50" : "bg-white"}`}
						>
							<div className="flex items-center gap-3 text-left">
								<User
									size={20}
									className={
										activeScope === "user" ? "text-sage-blue" : "text-gray-400"
									}
								/>
								<div>
									<span
										className={`block text-sm ${activeScope === "user" ? "font-bold text-sage-blue" : "font-semibold text-gray-700"}`}
									>
										Kullanıcı Genel
									</span>
									<span className="text-xs text-gray-500">
										Kullanıcının sepetindeki tüm ürünlere uygulanır.
									</span>
								</div>
							</div>
							{activeScope === "user" ? (
								<ChevronDown size={20} className="text-sage-blue" />
							) : (
								<ChevronRight size={20} className="text-gray-400" />
							)}
						</button>
					</div>

					{/* Category Scope */}
					<div
						className={`border rounded-lg overflow-hidden transition-all ${activeScope === "category" ? "ring-2 ring-sage-blue border-transparent" : "hover:border-gray-300"}`}
					>
						<button
							onClick={() => setActiveScope("category")}
							className={`w-full flex items-center justify-between p-4 transition-colors ${activeScope === "category" ? "bg-blue-50/50" : "bg-white"}`}
						>
							<div className="flex items-center gap-3 text-left">
								<Folder
									size={20}
									className={
										activeScope === "category"
											? "text-sage-blue"
											: "text-gray-400"
									}
								/>
								<div>
									<span
										className={`block text-sm ${activeScope === "category" ? "font-bold text-sage-blue" : "font-semibold text-gray-700"}`}
									>
										Kategori Bazlı
									</span>
									<span className="text-xs text-gray-500">
										Sadece seçilen kategorideki ürünlere uygulanır.
									</span>
								</div>
							</div>
							{activeScope === "category" ? (
								<ChevronDown size={20} className="text-sage-blue" />
							) : (
								<ChevronRight size={20} className="text-gray-400" />
							)}
						</button>
						{activeScope === "category" && (
							<div className="p-4 border-t bg-gray-50/30 space-y-3">
								<select
									value={selectedCategoryId}
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									className="w-full p-2.5 border rounded-md text-sm bg-white"
								>
									<option value="">Kategori Seçin</option>
									{(categories || []).map(
										(cat: { _id: string; name: string }) => (
											<option key={cat._id} value={cat._id}>
												{cat.name}
											</option>
										),
									)}
								</select>
							</div>
						)}
					</div>

					{/* Variant Scope */}
					<div
						className={`border rounded-lg overflow-hidden transition-all ${activeScope === "variant" ? "ring-2 ring-sage-blue border-transparent" : "hover:border-gray-300"}`}
					>
						<button
							onClick={() => setActiveScope("variant")}
							className={`w-full flex items-center justify-between p-4 transition-colors ${activeScope === "variant" ? "bg-blue-50/50" : "bg-white"}`}
						>
							<div className="flex items-center gap-3 text-left">
								<Tag
									size={20}
									className={
										activeScope === "variant"
											? "text-sage-blue"
											: "text-gray-400"
									}
								/>
								<div>
									<span
										className={`block text-sm ${activeScope === "variant" ? "font-bold text-sage-blue" : "font-semibold text-gray-700"}`}
									>
										Ürün/Varyant Bazlı
									</span>
									<span className="text-xs text-gray-500">
										Sadece belirli bir ürün varyantına uygulanır.
									</span>
								</div>
							</div>
							{activeScope === "variant" ? (
								<ChevronDown size={20} className="text-sage-blue" />
							) : (
								<ChevronRight size={20} className="text-gray-400" />
							)}
						</button>
						{activeScope === "variant" && (
							<div className="p-4 border-t bg-gray-50/30 space-y-4">
								<div className="relative">
									<input
										type="text"
										placeholder="Ürün ismi veya SKU ile ara..."
										value={productQuery}
										onChange={(e) => setProductQuery(e.target.value)}
										className="w-full p-2.5 border rounded-md text-sm bg-white pr-10"
									/>
									{productQuery && (
										<button
											onClick={() => setProductQuery("")}
											className="absolute right-3 top-3 text-gray-400"
										>
											<X size={16} />
										</button>
									)}
								</div>

								{productSearchData?.products &&
									productSearchData.products.length > 0 && (
										<div className="max-h-60 overflow-y-auto border rounded-md bg-white">
											{productSearchData.products.map(
												(product: { _id: string; title: string }) => (
													<div
														key={product._id}
														className="p-2 border-b last:border-0"
													>
														<p className="text-xs font-bold text-gray-500 mb-1">
															{product.title}
														</p>
														<div className="space-y-1">
															{/* We need to fetch variants for the product, but the search API might not include them in detail */}
															{/* For now let's show a placeholder or handle it differently if variants aren't in search results */}
															<div className="text-xs text-red-500 italic">
																Varyant seçimi için SKU giriniz veya
																geliştirilmelidir.
															</div>
														</div>
													</div>
												),
											)}
										</div>
									)}

								{/* Manual Variant ID input for now if search is not enough */}
								<input
									type="text"
									placeholder="Varyant ID (Manuel)"
									value={selectedVariantId}
									onChange={(e) => setSelectedVariantId(e.target.value)}
									className="w-full p-2.5 border rounded-md text-sm bg-white"
								/>
							</div>
						)}
					</div>
				</div>

				<Button
					onClick={handleCreateDiscount}
					disabled={isSubmitting}
					className="w-full bg-sage-blue hover:bg-indigo-400 text-white font-bold h-12 rounded-lg"
				>
					{isSubmitting ? "İşleniyor..." : "İndirimi Tanımla"}
				</Button>
			</div>
		</div>
	);
};

export default ManualDiscountManagement;

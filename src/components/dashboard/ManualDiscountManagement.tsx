"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ChevronDown,
	ChevronRight,
	Folder,
	Package,
	Trash2,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import type { IDiscount } from "@/models/Discount";
import type { ICategory } from "@/models/Product";
import httpClient from "@/utils/httpClient";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

interface IDiscountPopulated extends Omit<IDiscount, "scope"> {
	scope: {
		type: "user" | "category" | "product";
		userId?: string;
		categoryId?: string;
		productId?: string;
	};
}

interface ManualDiscountManagementProps {
	userId: string;
}

interface ProductSearchResult {
	_id: string;
	title: string;
	parentSku: string;
	images: string[];
	category: {
		_id: string;
		name: string;
	};
}

const ManualDiscountManagement: React.FC<ManualDiscountManagementProps> = ({
	userId,
}) => {
	const queryClient = useQueryClient();
	const [percentage, setPercentage] = useState<number>(10);
	const [activeScope, setActiveScope] = useState<
		"user" | "category" | "product"
	>("user");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [selectedProductId, setSelectedProductId] = useState("");
	const [selectedProductName, setSelectedProductName] = useState("");
	const [productQuery, setProductQuery] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch Categories - same as main page
	const { data: categories } = useQuery<ICategory[]>({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await httpClient.get("/categories");
			return res.data;
		},
	});

	// Fetch Products for Product Search - same as main page
	const { data: productSearchData } = useQuery<{
		products: ProductSearchResult[];
		total: number;
	}>({
		queryKey: ["productSearch", productQuery],
		queryFn: async () => {
			if (productQuery.length < 2) return { products: [], total: 0 };
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
		if (activeScope === "product" && !selectedProductId) {
			toast.error("Lütfen bir ürün seçin.");
			return;
		}

		setIsSubmitting(true);
		try {
			await httpClient.post("/discounts", {
				percentage,
				scopeType: activeScope,
				userId,
				categoryId: activeScope === "category" ? selectedCategoryId : undefined,
				productId: activeScope === "product" ? selectedProductId : undefined,
			});

			toast.success("İndirim başarıyla tanımlandı.");
			queryClient.invalidateQueries({
				queryKey: ["user-discounts-admin", userId],
			});
			// Reset form
			setPercentage(10);
			setSelectedProductId("");
			setSelectedProductName("");
			setProductQuery("");
		} catch (error) {
			console.error("Error creating discount:", error);
			toast.error("İndirim tanımlanırken bir hata oluştu.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeactivateDiscount = async (discountId: string) => {
		try {
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

	const handleSelectProduct = (product: ProductSearchResult) => {
		setSelectedProductId(product._id);
		setSelectedProductName(product.title);
		setProductQuery("");
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
										{discount.scope.productId && (
											<span className="text-gray-500 ml-1">
												{" "}
												(Ürün: {discount.scope.productId})
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
									{(categories || []).map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					{/* Product Scope */}
					<div
						className={`border rounded-lg overflow-hidden transition-all ${activeScope === "product" ? "ring-2 ring-sage-blue border-transparent" : "hover:border-gray-300"}`}
					>
						<button
							onClick={() => setActiveScope("product")}
							className={`w-full flex items-center justify-between p-4 transition-colors ${activeScope === "product" ? "bg-blue-50/50" : "bg-white"}`}
						>
							<div className="flex items-center gap-3 text-left">
								<Package
									size={20}
									className={
										activeScope === "product"
											? "text-sage-blue"
											: "text-gray-400"
									}
								/>
								<div>
									<span
										className={`block text-sm ${activeScope === "product" ? "font-bold text-sage-blue" : "font-semibold text-gray-700"}`}
									>
										Ürün Bazlı
									</span>
									<span className="text-xs text-gray-500">
										Sadece seçilen ürüne uygulanır.
									</span>
								</div>
							</div>
							{activeScope === "product" ? (
								<ChevronDown size={20} className="text-sage-blue" />
							) : (
								<ChevronRight size={20} className="text-gray-400" />
							)}
						</button>
						{activeScope === "product" && (
							<div className="p-4 border-t bg-gray-50/30 space-y-4">
								{/* Selected Product Display */}
								{selectedProductId && (
									<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
										<span className="text-sm font-medium text-green-800">
											{selectedProductName}
										</span>
										<button
											onClick={() => {
												setSelectedProductId("");
												setSelectedProductName("");
											}}
											className="text-green-600 hover:text-green-800"
										>
											<X size={16} />
										</button>
									</div>
								)}

								{/* Search Input */}
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

								{/* Product Search Results */}
								{productSearchData?.products &&
									productSearchData.products.length > 0 && (
										<div className="max-h-60 overflow-y-auto border rounded-md bg-white">
											{productSearchData.products.map((product) => (
												<button
													key={product._id}
													onClick={() => handleSelectProduct(product)}
													className={`w-full p-3 border-b last:border-0 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 ${
														selectedProductId === product._id
															? "bg-blue-50"
															: ""
													}`}
												>
													{/* Product Image */}
													<div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-100">
														{(() => {
															const imageSrc = product.images?.[0]
																? normalizeImageSrc(product.images[0])
																: "";
															return imageSrc ? (
																<Image
																	src={imageSrc}
																	alt={product.title}
																	fill
																	className="object-cover"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center text-gray-400">
																	<Package size={20} />
																</div>
															);
														})()}
													</div>

													{/* Product Info */}
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">
															{product.title}
														</p>
														<p className="text-xs text-gray-500">
															SKU: {product.parentSku}
															{product.category?.name && (
																<span className="ml-2">
																	• {product.category.name}
																</span>
															)}
														</p>
													</div>
												</button>
											))}
										</div>
									)}

								{/* No Results */}
								{productQuery.length >= 2 &&
									productSearchData?.products?.length === 0 && (
										<p className="text-sm text-gray-500 text-center py-4">
											Ürün bulunamadı.
										</p>
									)}
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

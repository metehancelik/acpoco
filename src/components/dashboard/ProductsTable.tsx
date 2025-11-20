"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { IProduct } from "@/models/Product";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

interface ProductsTableProps {
	products: IProduct[];
	onProductDeleted?: () => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
	products,
	onProductDeleted,
}) => {
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const formatAttributes = (
		attributes: { name: string; values: string[] }[],
	) => {
		return attributes
			.map((attr) => `${attr.name}: ${attr.values.join(", ")}`)
			.join(" | ");
	};

	const handleDelete = async (productId: string) => {
		if (
			!confirm(
				`Ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
			)
		) {
			return;
		}

		setDeletingId(productId);

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				// Optionally trigger a refresh of the products list
				if (onProductDeleted) {
					onProductDeleted();
				} else {
					// Reload the page if no callback provided
					window.location.reload();
				}
			} else {
				const error = await response.json();
				alert(error.error || "Failed to delete product");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete product");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
							>
								Images
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Title
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Parent SKU
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Category
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Attributes
							</th>
							<th
								scope="col"
								className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>
								Production Time
							</th>
							<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{products.map((product) => (
							<tr key={product._id} className="hover:bg-gray-50">
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
									<div className="flex items-center space-x-2">
										{product.images.slice(0, 3).map((image, index) => (
											<div
												key={index}
												className="relative h-12 w-12 rounded-lg overflow-hidden"
											>
												<Image
													src={normalizeImageSrc(image)}
													alt={`${product.title} image ${index + 1}`}
													fill
													className="object-cover"
													sizes="48px"
												/>
											</div>
										))}
										{product.images.length > 3 && (
											<span className="text-xs text-gray-500">
												+{product.images.length - 3} more
											</span>
										)}
									</div>
								</td>
								<td className="px-3 py-4 text-sm text-gray-900">
									<div className="font-medium">{product.title}</div>
									<div className="text-gray-500 text-xs mt-1">
										${product.price}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
									<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
										{product.parentSku}
									</span>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
									{product.category?.name || "N/A"}
								</td>
								<td className="px-3 py-4 text-sm text-gray-900">
									<div className="max-w-xs">
										{product.attributes && product.attributes.length > 0 ? (
											<div className="text-xs text-gray-600">
												{formatAttributes(product.attributes)}
											</div>
										) : (
											<span className="text-gray-400">No attributes</span>
										)}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
									{product.estimatedProductionTime || "N/A"}
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
									<div className="flex items-center justify-end space-x-2">
										<Link
											href={`/my-products/${product._id}`}
											className="text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</Link>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(product._id)}
											disabled={deletingId === product._id}
										>
											{deletingId === product._id ? "Deleting..." : "Delete"}
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{products.length === 0 && (
				<div className="text-center py-12">
					<div className="text-sm text-gray-500">No products found</div>
					<div className="mt-2">
						<Link
							href="/my-products/create"
							className="text-indigo-600 hover:text-indigo-500"
						>
							Create your first product
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductsTable;

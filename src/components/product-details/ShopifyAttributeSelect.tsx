"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ShopifyProduct, ShopifyVariant } from "@/utils/shopify";

interface ShopifyAttributeSelectProps {
	product: ShopifyProduct;
	selectedVariant: ShopifyVariant | null;
	// eslint-disable-next-line no-unused-vars
	onVariantChange: (_variant: ShopifyVariant | null) => void;
}

const ShopifyAttributeSelect = ({
	product,
	selectedVariant,
	onVariantChange,
}: ShopifyAttributeSelectProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>({});

	// Initialize selected options from selected variant or URL params
	useEffect(() => {
		if (selectedVariant) {
			const options: Record<string, string> = {};
			selectedVariant.selectedOptions.forEach((option) => {
				options[option.name] = option.value;
			});
			setSelectedOptions(options);
		} else {
			// Initialize from URL params
			const params: Record<string, string> = {};
			product.options?.forEach((option) => {
				const value = searchParams?.get(option.name);
				if (value && option.values.includes(value)) {
					params[option.name] = value;
				}
			});
			setSelectedOptions(params);
		}
	}, [selectedVariant, searchParams, product.options]);

	// Find variant based on selected options
	useEffect(() => {
		if (Object.keys(selectedOptions).length === 0) {
			// No options selected, use first available variant
			const firstVariant = product.variants.edges[0]?.node || null;
			onVariantChange(firstVariant);

			return;
		}

		// Find matching variant
		const matchingVariant =
			product.variants.edges.find((edge) => {
				const variant = edge.node;

				return variant.selectedOptions.every(
					(option) => selectedOptions[option.name] === option.value,
				);
			})?.node || null;

		onVariantChange(matchingVariant);
	}, [selectedOptions, product.variants, onVariantChange]);

	const handleOptionChange = (optionName: string, value: string) => {
		const newOptions = { ...selectedOptions, [optionName]: value };
		setSelectedOptions(newOptions);

		// Update URL search params
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set(optionName, value);
		router.push(`?${params.toString()}`, { scroll: false });
	};

	// Get available values for each option based on current selections and stock
	const getAvailableValues = (currentOptionName: string) => {
		const currentOption = product.options?.find(
			(opt) => opt.name === currentOptionName,
		);
		if (!currentOption) return [];

		// Get all values for this option that have available variants
		return currentOption.values.filter((value) => {
			// Create temporary selection with this value
			const tempSelection = { ...selectedOptions, [currentOptionName]: value };

			// Check if any variant matches this selection and is available
			return product.variants.edges.some((edge) => {
				const variant = edge.node;
				const matches = variant.selectedOptions.every(
					(option) => tempSelection[option.name] === option.value,
				);

				return (
					matches && variant.availableForSale && variant.inventoryQuantity > 0
				);
			});
		});
	};

	if (!product.options || product.options.length === 0) {
		return null;
	}

	return (
		<div className="mt-6 space-y-4">
			<h3 className="text-sm font-medium text-gray-900">Options</h3>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{product.options.map((option) => {
					const availableValues = getAvailableValues(option.name);

					return (
						<div key={option.id} className="space-y-2">
							<label
								htmlFor={option.id}
								className="text-sm font-medium text-gray-700"
							>
								{option.name}
							</label>
							<Select
								value={selectedOptions[option.name] || ""}
								onValueChange={(value) =>
									handleOptionChange(option.name, value)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={`Select ${option.name}`} />
								</SelectTrigger>
								<SelectContent>
									{option.values.map((value) => {
										const isAvailable = availableValues.includes(value);

										return (
											<SelectItem
												key={value}
												value={value}
												disabled={!isAvailable}
												className={!isAvailable ? "text-gray-400" : ""}
											>
												{value} {!isAvailable && "(Out of stock)"}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					);
				})}
			</div>

			{selectedVariant && (
				<div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Selected variant:</span>
						<span className="font-medium">{selectedVariant.title}</span>
					</div>
					{selectedVariant.sku && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">SKU:</span>
							<span className="font-medium">{selectedVariant.sku}</span>
						</div>
					)}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Price:</span>
						<span className="font-medium">€{selectedVariant.price}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Stock:</span>
						<span
							className={`font-medium ${selectedVariant.inventoryQuantity > 0 ? "text-green-600" : "text-red-600"}`}
						>
							{selectedVariant.inventoryQuantity > 0
								? `${selectedVariant.inventoryQuantity} available`
								: "Out of stock"}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Available for sale:</span>
						<span
							className={`font-medium ${selectedVariant.availableForSale ? "text-green-600" : "text-red-600"}`}
						>
							{selectedVariant.availableForSale ? "Yes" : "No"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShopifyAttributeSelect;

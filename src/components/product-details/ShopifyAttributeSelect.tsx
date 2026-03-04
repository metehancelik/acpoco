"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("Products");
	const router = useRouter();
	const searchParams = useSearchParams();

	// Initialize directly from selectedVariant (which already reflects URL params via server-side logic)
	// Using a lazy initializer avoids the empty-state flash that caused the infinite loop
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>(() => {
		if (selectedVariant) {
			const opts: Record<string, string> = {};
			selectedVariant.selectedOptions.forEach((opt) => {
				opts[opt.name] = opt.value;
			});
			return opts;
		}
		return {};
	});

	// Sync selectedOptions when selectedVariant changes externally (e.g. programmatic navigation)
	useEffect(() => {
		if (selectedVariant) {
			const opts: Record<string, string> = {};
			selectedVariant.selectedOptions.forEach((opt) => {
				opts[opt.name] = opt.value;
			});
			setSelectedOptions(opts);
		}
	}, [selectedVariant]);

	// Find variant based on selected options and notify parent only when it actually changes
	useEffect(() => {
		if (Object.keys(selectedOptions).length === 0) {
			const firstVariant = product.variants.edges[0]?.node || null;
			if (firstVariant?.id !== selectedVariant?.id) {
				onVariantChange(firstVariant);
			}
			return;
		}

		const matchingVariant =
			product.variants.edges.find((edge) => {
				const variant = edge.node;
				return variant.selectedOptions.every(
					(option) => selectedOptions[option.name] === option.value,
				);
			})?.node || null;

		// Guard: only propagate if the variant actually changed to break the feedback loop
		if (matchingVariant?.id !== selectedVariant?.id) {
			onVariantChange(matchingVariant);
		}
	}, [selectedOptions, product.variants, onVariantChange, selectedVariant]);

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
			<h3 className="text-sm font-medium text-gray-900">{t("options")}</h3>
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
									<SelectValue placeholder={`${t("select")} ${option.name}`} />
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
												{value} {!isAvailable && `(${t("outOfStock")})`}
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
						<span className="text-sm text-gray-600">
							{t("selectedVariant")}
						</span>
						<span className="font-medium">{selectedVariant.title}</span>
					</div>
					{selectedVariant.sku && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">{t("sku")}</span>
							<span className="font-medium">{selectedVariant.sku}</span>
						</div>
					)}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">{t("price")}</span>
						<span className="font-medium">€{selectedVariant.price}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">{t("stock")}</span>
						<span
							className={`font-medium ${selectedVariant.inventoryQuantity > 0 ? "text-green-600" : "text-red-600"}`}
						>
							{selectedVariant.inventoryQuantity > 0
								? `${selectedVariant.inventoryQuantity} ${t("available")}`
								: t("outOfStock")}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">
							{t("availableForSale")}
						</span>
						<span
							className={`font-medium ${selectedVariant.availableForSale ? "text-green-600" : "text-red-600"}`}
						>
							{selectedVariant.availableForSale ? t("yes") : t("no")}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShopifyAttributeSelect;

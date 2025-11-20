"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { IProduct } from "@/models/Product";
import httpClient from "@/utils/httpClient";

interface ProductVariant {
	_id: string;
	productId: string;
	childSku: string;
	price: number;
	attributes: { name: string; value: string }[];
}

interface AttributeSelectProps {
	productData: IProduct;
	initialVariant: ProductVariant | null;
	productId: string;
}

const AttributeSelect = ({
	productData,
	initialVariant,
	productId,
}: AttributeSelectProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedAttributes, setSelectedAttributes] = useState<
		Record<string, string>
	>(
		initialVariant?.attributes?.reduce(
			(acc: Record<string, string>, attr: { name: string; value: string }) => {
				acc[attr.name] = attr.value;

				return acc;
			},
			{},
		) || {},
	);

	// Initialize selectedAttributes from URL params if no initialVariant
	useEffect(() => {
		if (!initialVariant) {
			const params: Record<string, string> = {};
			productData.attributes.forEach((attr) => {
				const value = searchParams?.get(attr.name);
				if (value) {
					params[attr.name] = value;
				}
			});
			setSelectedAttributes(params);
		}
	}, [searchParams, productData.attributes, initialVariant]);

	const { data: variant } = useQuery({
		queryKey: ["productVariant", productId, selectedAttributes],
		queryFn: async () => {
			const response = await httpClient.get<ProductVariant>(
				`/products/${productId}/variant`,
				{
					params: selectedAttributes,
				},
			);

			return response.data;
		},
		enabled: Object.keys(selectedAttributes).length > 0,
	});

	// Update price when variant changes
	useEffect(() => {
		if (variant?.price) {
			const priceElement = document.querySelector(
				".text-3xl.tracking-tight.text-gray-900",
			);
			if (priceElement) {
				priceElement.textContent = `Fiyat: ${variant.price}`;
			}
		}
	}, [variant]);

	const handleAttributeChange = (name: string, value: string) => {
		const newAttributes = { ...selectedAttributes, [name]: value };
		setSelectedAttributes(newAttributes);

		// Update URL search params
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set(name, value);
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="mt-6 grid grid-cols-3 gap-2">
			{productData?.attributes?.map(
				(attribute: { name: string; values: string[] }) => {
					return (
						<Select
							key={attribute.name}
							value={selectedAttributes[attribute.name]}
							onValueChange={(value) =>
								handleAttributeChange(attribute.name, value)
							}
						>
							<SelectTrigger className="col-span-1">
								<SelectValue placeholder={attribute.name} />
							</SelectTrigger>
							<SelectContent>
								{attribute.values.map((value) => (
									<SelectItem key={value} value={value}>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					);
				},
			)}
		</div>
	);
};

export default AttributeSelect;

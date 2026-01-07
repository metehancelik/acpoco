"use client";

import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import AddToFavoritesButton from "@/components/product-details/addToFavoritesButton";
import ShopifyAttributeSelect from "@/components/product-details/ShopifyAttributeSelect";
import { useDiscounts } from "@/hooks/useDiscounts";
import type { ShopifyProduct, ShopifyVariant } from "@/utils/shopify";

interface ShopifyProductClientProps {
	product: ShopifyProduct;
	initialVariant?: ShopifyVariant;
}

const ShopifyProductClient = ({
	product,
	initialVariant,
}: ShopifyProductClientProps) => {
	const t = useTranslations("Products");
	const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
		initialVariant || product.variants.edges[0]?.node || null,
	);
	const [selectedIndex, setSelectedIndex] = useState(0);
	// Track if the image selection was manual (user clicked on an image)
	// to prevent useEffect from overriding the selection
	const isManualImageSelection = useRef(false);

	// Get images to display - collect from product AND variants, then unique by URL
	const uniqueImages = (() => {
		const allImages = [
			...product.images.edges.map((edge) => edge.node),
			...product.variants.edges
				.map((edge) => edge.node.image)
				.filter((img): img is NonNullable<typeof img> => !!img),
		];

		// Filter by URL to remove duplicates
		const seenUrls = new Set<string>();
		return allImages.filter((img) => {
			if (seenUrls.has(img.url)) return false;
			seenUrls.add(img.url);
			return true;
		});
	})();

	// When an image is clicked, only change the displayed image
	// Do NOT change the variant - variant only changes via dropdown selection
	const handleTabChange = (index: number) => {
		// Mark this as a manual image selection
		isManualImageSelection.current = true;
		setSelectedIndex(index);

		// Reset the flag after a short delay to allow useEffect to run for dropdown changes
		setTimeout(() => {
			isManualImageSelection.current = false;
		}, 100);
	};

	// When variant is changed (e.g. via dropdown), sync the gallery index
	// Skip if the change was triggered by a manual image selection
	useEffect(() => {
		if (isManualImageSelection.current) {
			return;
		}
		if (selectedVariant?.image) {
			const index = uniqueImages.findIndex(
				(img) => img.url === selectedVariant.image?.url,
			);
			if (index !== -1) {
				setSelectedIndex(index);
			}
		}
	}, [selectedVariant, uniqueImages]);

	const { getDiscountedPrice } = useDiscounts();

	const { finalPrice: discountedVariantPrice, discountPercent } =
		getDiscountedPrice(
			selectedVariant ? Number(selectedVariant.price) : 0,
			(product as unknown as { category: { _id: string } }).category?._id ||
				(product as unknown as { category: string }).category,
			selectedVariant?.id,
		);
	const showDiscount = discountPercent > 0;

	return (
		<div className="bg-white w-full mt-8 lg:mt-12">
			<div className="mx-auto px-4 py-8 md:px-0 sm:py-12 lg:max-w-6xl w-full">
				<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
					{/* Image gallery */}
					<TabGroup
						selectedIndex={selectedIndex}
						onChange={handleTabChange}
						className="flex flex-col-reverse"
					>
						{/* Image selector */}
						<div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
							<TabList className="grid grid-cols-4 gap-6">
								{uniqueImages.map((image) => (
									<Tab
										key={image.id}
										className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4"
									>
										<span className="sr-only">
											{image.altText || product.title}
										</span>
										<span className="absolute inset-0 overflow-hidden rounded-md">
											<Image
												width={400}
												height={400}
												alt={image.altText || product.title}
												src={image.url}
												className="size-full object-cover"
											/>
										</span>
										<span
											aria-hidden="true"
											className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
										/>
									</Tab>
								))}
							</TabList>
						</div>

						<TabPanels>
							{uniqueImages.map((image) => (
								<TabPanel key={image.id}>
									<Image
										width={800}
										height={800}
										alt={image.altText || product.title}
										src={image.url}
										className="aspect-square w-full object-cover rounded-lg"
									/>
								</TabPanel>
							))}
						</TabPanels>
					</TabGroup>

					{/* Product info */}
					<div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							{product.title}
						</h1>

						{selectedVariant && (
							<>
								<h2 className="mt-2 text-lg text-gray-600">
									SKU: {selectedVariant.sku || "N/A"}
								</h2>
								<p className="text-2xl font-bold text-black mt-2 flex items-center gap-3">
									{showDiscount ? (
										<>
											<span>€{discountedVariantPrice}</span>
											<span className="text-lg text-gray-500 line-through">
												€{selectedVariant.price}
											</span>
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												%{discountPercent} {t("discount")}
											</span>
										</>
									) : (
										<span>€{selectedVariant.price}</span>
									)}
								</p>
								<div className="mt-2 flex items-center space-x-4">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											selectedVariant.availableForSale &&
											selectedVariant.inventoryQuantity > 0
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{selectedVariant.availableForSale &&
										selectedVariant.inventoryQuantity > 0
											? `${selectedVariant.inventoryQuantity} ${t("inStock")}`
											: t("outOfStock")}
									</span>
								</div>
							</>
						)}

						<div className="mt-6">
							<h3 className="sr-only">{t("description")}</h3>
							<div
								//biome-ignore lint/security/noDangerouslySetInnerHtml: fix late
								dangerouslySetInnerHTML={{
									__html: product.descriptionHtml || product.description,
								}}
								className="space-y-4 text-base text-gray-700 html-content"
							/>
						</div>

						{/* Variant Selection */}
						<ShopifyAttributeSelect
							product={product}
							selectedVariant={selectedVariant}
							onVariantChange={setSelectedVariant}
						/>

						{/* Action Buttons */}
						<div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-end">
							{selectedVariant && <AddToFavoritesButton product={product} />}
						</div>

						{/* Product Details */}
						<section aria-labelledby="details-heading" className="mt-12">
							<h2 id="details-heading" className="sr-only">
								{t("additionalDetails")}
							</h2>

							<div className="divide-y divide-gray-200 border-t">
								{/* Additional product info */}
								<Disclosure as="div">
									<h3>
										<DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
											<span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
												{t("productInformation")}
											</span>
											<span className="ml-6 flex items-center">
												<PlusIcon
													aria-hidden="true"
													className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
												/>
												<MinusIcon
													aria-hidden="true"
													className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-open:block"
												/>
											</span>
										</DisclosureButton>
									</h3>
									<DisclosurePanel className="pb-6">
										<dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
											<div>
												<dt className="text-sm font-medium text-gray-500">
													{t("vendor")}
												</dt>
												<dd className="text-sm text-gray-900">
													{product.vendor}
												</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">
													{t("productType")}
												</dt>
												<dd className="text-sm text-gray-900">
													{product.productType}
												</dd>
											</div>
											{product.tags.length > 0 && (
												<div className="sm:col-span-2">
													<dt className="text-sm font-medium text-gray-500">
														{t("tags")}
													</dt>
													<dd className="text-sm text-gray-900">
														<div className="flex flex-wrap gap-1 mt-1">
															{product.tags.map((tag) => (
																<span
																	key={tag}
																	className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
																>
																	{tag}
																</span>
															))}
														</div>
													</dd>
												</div>
											)}
										</dl>
									</DisclosurePanel>
								</Disclosure>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShopifyProductClient;

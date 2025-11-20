import type { FC } from "react";

interface ProductPageProps {
	params: {
		id: string;
	};
}

const ProductPage: FC<ProductPageProps> = ({ params }) => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Product Details</h1>
			<p className="text-lg mb-4">
				This is a placeholder for the Product Details page.
			</p>
			<p className="text-md mb-2">Product ID: {params.id}</p>
			<p className="mt-4">
				Here you can add functionality to display the product&apos;s
				information, including its name, description, price, and seller details.
			</p>
		</div>
	);
};

export default ProductPage;

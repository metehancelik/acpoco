import type { ICategory, IProduct } from "@/models/Product";

import Categories from "./Categories";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";

type Props = {
	products: IProduct[];
	categories: ICategory[];
};
const ProductList = ({ products, categories }: Props) => {
	return (
		<div className="bg-white">
			<div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
				<Categories categories={categories} />
				<div className="mt-4 sm:mt-5">
					<ProductFilter />
				</div>
				<div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-5">
					{products?.map((product: IProduct) => (
						<ProductCard product={product} key={product._id} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductList;

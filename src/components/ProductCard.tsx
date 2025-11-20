import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
	sellerName: string;
}

export default function ProductCard({
	id,
	name,
	price,
	imageUrl,
	sellerName,
}: ProductCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<Image
				src={imageUrl}
				alt={name}
				width={300}
				height={200}
				className="w-full h-48 object-cover"
			/>
			<div className="p-4">
				<h3 className="text-lg font-semibold">{name}</h3>
				<p className="text-gray-600">${price.toFixed(2)}</p>
				<p className="text-sm text-gray-500">by {sellerName}</p>
				<Link
					href={`/products/${id}`}
					className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					View Details
				</Link>
			</div>
		</div>
	);
}

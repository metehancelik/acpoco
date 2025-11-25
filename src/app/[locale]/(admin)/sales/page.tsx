"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import FilterForm from "@/components/sales/FilterForm";
import SellerOrdersTable from "@/components/sales/SellerOrdersTable";
import AlertNotification from "@/utils/alertNotification";

export default function AdminSalesPage() {
	const searchParams = useSearchParams();

	const { data, isLoading, error } = useQuery({
		queryKey: ["orders", searchParams?.toString()],
		queryFn: async () => {
			const res = await axios.get(
				`/api/orders?view=print&page=${searchParams?.get("page") || 1}&${searchParams?.toString()}`,
			);

			return res.data;
		},
	});
	console.log(data);
	if (error) {
		AlertNotification("Error fetching orders", "error");
	}

	return (
		<div>
			<div className="w-full grid grid-cols-12 gap-4">
				<FilterForm />
			</div>
			{isLoading ? (
				<div className="flex justify-center items-center h-screen">
					<Loader2 className="w-10 h-10 animate-spin" />
				</div>
			) : (
				<div id="orders-table-container">
					<SellerOrdersTable
						data={data?.orders}
						totalPages={data?.totalPages}
					/>
				</div>
			)}
		</div>
	);
}

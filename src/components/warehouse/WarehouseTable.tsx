"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import WarehouseUpdateModal from "./WarehouseUpdateModal";

type IWarehouse = {
	_id: string;
	country: string;
	countryCode: string;
	price: number;
};
const WarehouseTable = () => {
	const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(
		null,
	);

	const { data, isLoading } = useQuery({
		queryKey: ["warehouse"],
		queryFn: () => httpClient.get("/warehouse"),
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (id: string) =>
			httpClient.delete(`/warehouse`, {
				data: {
					_id: id,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["warehouse"] });
		},
	});

	const handleDelete = (id: string) => {
		mutation.mutate(id);
	};

	if (isLoading) return <div>Yükleniyor...</div>;

	return (
		<div>
			<h1 className="font-bold">Ara Depo Listesi</h1>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 border-b border-gray-500 p-2 justify-between">
					<p className="w-full text-center">Ülke</p>
					<p className="w-full text-center">Ülke Kodu</p>
					<p className="w-full text-center">Fiyat</p>
					<p className="w-full text-center">Düzenle</p>
					<p className="w-full text-center">Sil</p>
				</div>
				{data?.data.map((warehouse: IWarehouse) => (
					<div
						key={warehouse._id}
						className="flex gap-2 border-b border-gray-200 p-2 justify-between"
					>
						<p className="text-center w-full">{warehouse.country}</p>
						<p className="text-center w-full">{warehouse.countryCode}</p>
						<p className="text-center w-full">{warehouse.price}</p>
						<div className="w-full flex justify-center">
							<Button
								onClick={() => {
									setSelectedWarehouse(warehouse);
								}}
							>
								Düzenle
							</Button>
						</div>
						<div className="w-full flex justify-center">
							<Button
								variant="destructive"
								onClick={() => handleDelete(warehouse._id)}
							>
								Sil
							</Button>
						</div>
					</div>
				))}
			</div>
			<WarehouseUpdateModal
				isOpen={!!selectedWarehouse}
				onClose={() => setSelectedWarehouse(null)}
				warehouse={selectedWarehouse}
			/>
		</div>
	);
};

export default WarehouseTable;

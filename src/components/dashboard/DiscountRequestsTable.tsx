"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";

import type { IDiscountRequestPopulated } from "@/models/DiscountRequest";
import httpClient from "@/utils/httpClient";

import Loading from "../shared/Loading";
import { Button } from "../ui/button";
import DiscountApprovalModal from "./DiscountApprovalModal";

const DiscountRequestsTable = () => {
	const queryClient = useQueryClient();
	const [selectedRequest, setSelectedRequest] =
		useState<IDiscountRequestPopulated | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: requests, isLoading } = useQuery<IDiscountRequestPopulated[]>({
		queryKey: ["discount-requests-admin"],
		queryFn: async () => {
			const response = await httpClient.get("/discount-requests?mode=admin");
			return response.data;
		},
	});

	const handleManage = (request: IDiscountRequestPopulated) => {
		setSelectedRequest(request);
		setIsModalOpen(true);
	};

	if (isLoading) return <Loading />;

	return (
		<div className="bg-white rounded-lg shadow-sm border overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left">
					<thead className="bg-gray-50 text-gray-700 uppercase text-xs">
						<tr>
							<th className="px-6 py-4 font-semibold">Kullanıcı</th>
							<th className="px-6 py-4 font-semibold">Ürünler</th>
							<th className="px-6 py-4 font-semibold">Tarih</th>
							<th className="px-6 py-4 font-semibold">Durum</th>
							<th className="px-6 py-4 font-semibold">İşlem</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{requests?.length === 0 && (
							<tr>
								<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
									Henüz indirim talebi bulunmuyor.
								</td>
							</tr>
						)}
						{requests?.map((request) => (
							<tr
								key={request._id}
								className="hover:bg-gray-50 transition-colors"
							>
								<td className="px-6 py-4">
									<div className="font-medium text-gray-900">
										{request.userId?.name} {request.userId?.surname}
									</div>
									<div className="text-gray-500 text-xs">
										{request.userId?.email}
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="max-w-xs space-y-1">
										{request.items.map((item, idx) => (
											<div key={idx} className="text-xs truncate">
												• {item.productId?.title}{" "}
												{item.variantId?.childSku
													? `(${item.variantId.childSku})`
													: ""}{" "}
												x {item.quantity}
											</div>
										))}
									</div>
								</td>
								<td className="px-6 py-4 text-gray-500">
									{format(new Date(request.createdAt), "d MMMM yyyy HH:mm", {
										locale: tr,
									})}
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
											request.status === "pending"
												? "bg-yellow-100 text-yellow-800"
												: request.status === "approved"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
										}`}
									>
										{request.status === "pending"
											? "Bekliyor"
											: request.status === "approved"
												? "Onaylandı"
												: "Reddedildi"}
									</span>
								</td>
								<td className="px-6 py-4">
									{request.status === "pending" ? (
										<Button
											size="sm"
											onClick={() => handleManage(request)}
											className="bg-sage-blue hover:bg-indigo-400 text-xs"
										>
											Yönet
										</Button>
									) : (
										<span className="text-xs text-gray-400 italic">
											Tamamlandı
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<DiscountApprovalModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				request={selectedRequest}
				onSuccess={() =>
					queryClient.invalidateQueries({
						queryKey: ["discount-requests-admin"],
					})
				}
			/>
		</div>
	);
};

export default DiscountRequestsTable;

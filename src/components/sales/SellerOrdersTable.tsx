import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Download, Printer, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { Tooltip } from "react-tooltip";

import { Badge } from "@/components/ui/badge";
import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import { getWarehouseLocation } from "@/lib/utils";
import type { IProduct } from "@/models/Product";
import AlertNotification from "@/utils/alertNotification";
import { classNames } from "@/utils/classNames";
import { formatDate } from "@/utils/formatDate";
import { formatStatus } from "@/utils/formatStatus";
import httpClient from "@/utils/httpClient";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

import Pagination from "../shared/Pagination";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import AddNoteModal from "./AddNoteModal";
import AmazonCustomizationDisplay from "./AmazonCustomizationDisplay";
import ConfirmStatusChange from "./ConfirmStatusChange";
import CustomerNotesModal from "./CustomerNotesModal";
import { MatchCard } from "./MatchCard";
import PaymentModal from "./PaymentModal";
import WarehouseModal from "./WarehouseModal";

interface Props {
	data: (OrderWithPopulatedItems & {
		_id: string;
		warehouse: string;
		labelUrl: string;
	})[];
	totalPages: number;
}
const SellerOrdersTable: React.FC<Props> = ({ data, totalPages }) => {
	const session = useSession();
	const queryClient = useQueryClient();
	const [noteModalOpen, setNoteModalOpen] = React.useState(false);
	const [messageModal, setMessageModal] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [isGift, setIsGift] = React.useState(false);
	const [selectedOrderIds, setSelectedOrderIds] = React.useState<string[]>([]);
	const [isAllSelected, setIsAllSelected] = React.useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
	const [confirmStatusChangeOpen, setConfirmStatusChangeOpen] =
		React.useState(false);
	const [isWarehouseModalOpen, setIsWarehouseModalOpen] = React.useState(false);
	const [selectedStatus, setSelectedStatus] = React.useState("");
	const [selectedOrder, setSelectedOrder] = React.useState<
		(OrderWithPopulatedItems & { _id: string }) | null
	>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	const openNoteModal = (order: OrderWithPopulatedItems & { _id: string }) => {
		setSelectedOrder(order);
		setNoteModalOpen(true);
	};

	const toggleOrder = (orderId: string) => {
		if (selectedOrderIds.includes(orderId)) {
			setSelectedOrderIds(selectedOrderIds.filter((id) => id !== orderId));
		} else {
			setSelectedOrderIds([...selectedOrderIds, orderId]);
		}
		setIsAllSelected(false);
	};

	const renderStatus = (status: string) => {
		if (status === "waitingMatch") {
			return (
				<p
					className={
						"py-2 px-4 bg-orange-500 text-white rounded-md text-center font-bold"
					}
				>
					{formatStatus(status) || "Ödeme Bekliyor"}
				</p>
			);
		}
		if (status === "waitingPayment") {
			return (
				<p
					className={
						"py-2 px-4 bg-sage-blue text-white rounded-md text-center font-bold"
					}
				>
					{formatStatus(status) || "Ödeme Bekliyor"}
				</p>
			);
		}
		if (status === "waitingProduction") {
			return (
				<p
					className={
						"py-2 px-4 bg-warning text-white rounded-md text-center font-bold"
					}
				>
					{formatStatus(status) || "Ödeme Bekliyor"}
				</p>
			);
		}
		if (status === "processing") {
			return (
				<p
					className={
						"py-2 px-4 bg-sage-blue text-white rounded-md text-center font-bold"
					}
				>
					{formatStatus(status) || "Ödeme Bekliyor"}
				</p>
			);
		}
		if (status === "shipped") {
			return (
				<p
					className={
						"py-2 px-4 bg-primary text-white rounded-md text-center font-bold"
					}
				>
					{formatStatus(status) || "Ödeme Bekliyor"}
				</p>
			);
		}
	};

	const onClose = () => {
		setConfirmStatusChangeOpen(false);
		setSelectedStatus("");
		setSelectedOrderIds([]);
		setIsAllSelected(false);
	};

	const closePaymentModal = () => {
		setPaymentModalOpen(false);
		setSelectedOrder(null);
	};

	const handlePayment = (order: OrderWithPopulatedItems & { _id: string }) => {
		setSelectedOrder(order);
		setPaymentModalOpen(true);
	};
	const handleWareHouseModal = (
		order: OrderWithPopulatedItems & { _id: string },
	) => {
		setSelectedOrder(order);
		setIsWarehouseModalOpen(true);
	};
	const uploadLabelMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const response = await axios.post(
				`/api/orders/label/${selectedOrder?._id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			return response.data;
		},
		onSuccess: () => {
			// Revalidate the orders data
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => {
			// Handle error appropriately - you might want to show a toast notification here
			console.error("Error uploading label:", error);
			AlertNotification("Etiket yükleme hatası", "error");
		},
	});

	const deleteLabelMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await axios.delete(`/api/orders/label/${id}`);

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => {
			console.error("Error deleting label:", error);
			AlertNotification("Etiket silme hatası", "error");
		},
	});

	const uploadImageMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const response = await axios.post(`/api/orders/image`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data;
		},
		onSuccess: () => {
			// Revalidate the orders data
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => {
			// Handle error appropriately - you might want to show a toast notification here
			console.error("Error uploading label:", error);
			AlertNotification("Görsel yükleme hatası", "error");
		},
	});

	const deleteImageMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			const response = await axios.delete(`/api/orders/image`, {
				data: formData,
			});

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => {
			console.error("Error deleting image:", error);
			AlertNotification("Görsel silme hatası", "error");
		},
	});
	const updateWarehouseMutation = useMutation({
		mutationFn: async ({
			warehouse,
			orderId,
		}: {
			warehouse: string;
			orderId: string;
		}) => {
			await httpClient.patch(`orders/warehouse/${orderId}`, {
				warehouse,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: () => {
			AlertNotification("Depo güncelleme hatası", "error");
		},
	});

	const searchParams = useSearchParams();
	const currentStatus = searchParams?.get("status");

	const getEmptyMessage = () => {
		switch (currentStatus) {
			case "waitingProduction":
				return "Üretim bekleyen siparişiniz bulunmamaktadır";
			case "processing":
				return "Üretimde olan siparişiniz bulunmamaktadır";
			case "shipped":
				return "Kargo teslim edilmiş siparişiniz bulunmamaktadır";
			default:
				return "Bekleyen siparişiniz bulunmamaktadır";
		}
	};

	const handlePrint = async () => {
		try {
			setIsLoading(true);
			AlertNotification("Generating PDF...", "info");

			let response: Response;

			if (selectedOrderIds && selectedOrderIds.length > 0) {
				// If there are selected orders, use POST request
				response = await fetch("/api/orders/pdf", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						orderIds: selectedOrderIds,
					}),
				});
			} else {
				// If no selected orders, use GET request with search parameters
				const currentSearchParams = new URLSearchParams(
					searchParams?.toString() || "",
				);
				const pdfUrl = `/api/orders/pdf?${currentSearchParams.toString()}`;
				response = await fetch(pdfUrl);
			}

			if (!response.ok) {
				throw new Error(
					`Failed to generate PDF: ${response.status} ${response.statusText}`,
				);
			}

			// Get the PDF blob
			const blob = await response.blob();

			// Create a temporary link to download the PDF
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.href = url;
			link.download = selectedOrderIds?.length
				? "selected_orders.pdf"
				: "order_items.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up the object URL
			URL.revokeObjectURL(url);

			AlertNotification("PDF generated successfully", "success");

			// Revalidate the orders query to reflect the status changes
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		} catch (err) {
			console.error("PDF generation error:", err);
			AlertNotification("Error generating PDF", "error");
		} finally {
			setIsLoading(false);
		}
	};
	const handleWarehouse = (
		e: React.ChangeEvent<HTMLSelectElement>,
		orderId: string,
	) => {
		updateWarehouseMutation.mutate({ warehouse: e.target.value, orderId });
	};

	return (
		<div className="mt-2">
			<div className="mt-4 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:ml-0 lg:mr-2 overflow-y-auto scroll">
					<div className="inline-block min-w-full py-2 align-middle max-h-[75vh]">
						<div className="flex items-center justify-start  mb-4 gap-2">
							{session.data?.user?.role === "ADMIN" && (
								<Select
									disabled={!isAllSelected && selectedOrderIds.length === 0}
									onValueChange={(value) => {
										setSelectedStatus(value);
										setConfirmStatusChangeOpen(true);
									}}
								>
									<SelectTrigger className="bg-sage-blue text-white w-[200px]">
										<SelectValue placeholder="Durum Değiştir" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="waitingProduction">
											Üretim Bekliyor
										</SelectItem>
										<SelectItem value="processing">Üretiliyor</SelectItem>
										<SelectItem value="shipped">Kargo Teslim</SelectItem>
									</SelectContent>
								</Select>
							)}
							{session.data?.user.role === "ADMIN" && (
								<div className="col-span-2 flex items-end justify-end">
									<Button
										onClick={handlePrint}
										className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
										disabled={isLoading || !data}
									>
										<Printer className="h-4 w-4" />
										Siparişleri Yazdır
									</Button>
								</div>
							)}
						</div>
						<div className=" sm:rounded-lg">
							<table className="min-w-full divide-y divide-secondary">
								<thead>
									<tr>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 pl-4 pr-3 text-left text-sm rounded-tl-lg font-semibold text-gray-900 sm:pl-6 bg-gray-50"
										>
											<div className="flex items-center space-x-2">
												{session.data?.user?.role === "ADMIN" && (
													<input
														type="checkbox"
														checked={isAllSelected}
														onChange={() => {
															setIsAllSelected(!isAllSelected);
															if (!isAllSelected) {
																setSelectedOrderIds(
																	data.map((order) => order._id),
																);
															} else {
																setSelectedOrderIds([]);
															}
														}}
													/>
												)}
												<p>Durum</p>
											</div>
										</th>

										<th
											scope="col"
											className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50"
										>
											Mağaza İsmi
										</th>

										<th
											scope="col"
											className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50"
										>
											Sipariş Tarihi
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50"
										>
											Son Teslim Tarihi
										</th>

										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
										>
											Ürün Bilgileri
										</th>
										{/* <th
                      scope="col"
                      className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
                    >
                      Adet
                    </th> */}
										{/* <th
                      scope="col"
                      className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
                    >
                      Varyasyon
                    </th> */}
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
										>
											Notlar
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50 "
										>
											Adres
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50 "
										>
											Kargo
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50 "
										>
											Ara Depo
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
										>
											Ücret
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50"
										>
											Görsel
										</th>
										<th
											scope="col"
											className="sticky top-0 z-10 py-3.5 text-sm pl-3 pr-4 sm:pr-6 bg-gray-50 rounded-tr-lg"
										>
											İşlemler
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-gray-50">
									{data && data.length === 0 ? (
										<tr>
											<td
												colSpan={11}
												className="text-center py-8 text-gray-500"
											>
												{getEmptyMessage()}
											</td>
										</tr>
									) : (
										data?.map((order) => (
											<tr key={order.orderId}>
												<td className="whitespace-nowrap py-1 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-6">
													<div className="flex items-center space-x-2">
														{session.data?.user?.role === "ADMIN" && (
															<input
																type="checkbox"
																checked={selectedOrderIds.includes(order._id)}
																onChange={() => toggleOrder(order._id)}
															/>
														)}
														{renderStatus(order.status)}
													</div>
												</td>

												<td className="whitespace-nowrap px-3 py-1 text-sm ">
													<p className="min-w-24">
														{order.advancedOptions.storeId.storeName}
													</p>
													<p>{order.orderId}</p>
												</td>
												<td className="px-3 py-1 text-xs ">
													<div className="flex flex-col min-w-24">
														<p>{formatDate(order.orderDate)}</p>
													</div>
												</td>
												<td className="px-3 py-1 text-xs ">
													<div className="flex flex-col min-w-24">
														<p>{formatDate(order.shipByDate)}</p>
													</div>
												</td>
												<td className="whitespace-nowrap px-3 py-1 text-xs relative">
													{(
														order.items as Array<
															Omit<
																OrderWithPopulatedItems["items"][0],
																"matchId"
															> & {
																matchId?: IProduct;
															}
														>
													).map((item) => {
														return (
															<div
																key={item.orderItemId}
																className="mb-1 flex space-x-4 mt-4 justify-start items-center"
															>
																<div className="flex flex-col min-w-24 items-center justify-between">
																	<div className="flex flex-col gap-2 items-start w-full justify-center">
																		<Image
																			src={normalizeImageSrc(item.imageUrl!)}
																			alt={item.sku}
																			width={100}
																			height={100}
																			className="w-24 h-24 object-cover rounded-md"
																		/>
																		<p>{item.sku} </p>
																	</div>
																	{item.matchId ? (
																		<Badge
																			variant="outline"
																			className="bg-green-500 text-white hover:bg-green-600 peer cursor-pointer"
																		>
																			Eşleşti
																		</Badge>
																	) : (
																		<div className="w-full flex justify-start">
																			<MatchCard
																				orderId={order._id}
																				orderItem={item}
																				orderStatus={order.status}
																			/>
																		</div>
																	)}
																</div>
																<div className="max-w-40 overflow-x-auto">
																	{
																		<div
																			key={item.orderItemId}
																			className="flex flex-col items-start justify-center h-full"
																		>
																			{item.amazonCustomizationOptions &&
																			item.amazonCustomizationOptions.length >
																				0 ? (
																				<AmazonCustomizationDisplay
																					options={
																						item.amazonCustomizationOptions
																					}
																					isVisible={true}
																				/>
																			) : (
																				item.options.map((option) => {
																					return (
																						<div
																							className="flex items-center space-x-1"
																							key={`$-${option.name}`}
																						>
																							<p className="text-[#1F2937] text-xs">
																								{option.name}:
																							</p>
																							<p className="text-xs">
																								{option.value}
																							</p>
																						</div>
																					);
																				})
																			)}
																			<p className="text-xs font-bold">
																				Adet:{item.quantity}
																			</p>
																		</div>
																	}
																</div>
																{/* <p>{item.name.substring(0, 30)}</p> */}
															</div>
														);
													})}
												</td>
												{/* <td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                        <div className="flex flex-col">
                          {order.items.map((item) => {
                            return (
                              <div
                                key={item.orderItemId}
                                className="flex items-center justify-center h-10 mb-1"
                              >
                                <p>{item.quantity}</p>
                              </div>
                            );
                          })}
                        </div>
                      </td> */}

												{/* FIXME: VARYASYON <td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex flex-col justify-between h-full">
                          {order.items.map((item) => {
                            return (
                              <div
                                key={item.orderItemId}
                                className="flex flex-col items-start justify-center h-full"
                              >
                                {item.options.map((option) => {
                                  return (
                                    <div
                                      className="flex items-center space-x-1"
                                      key={`$-${option.name}`}
                                    >
                                      <p className="text-[#1F2937] text-xs">
                                        {option.name}:
                                      </p>
                                      <p className="text-xs">{option.value}</p>
                                    </div>
                                  );
                                })}
                                <p className="text-xs font-bold">
                                  Adet:{item.quantity}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </td> */}

												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<div className="flex space-x-2 justify-center items-center">
														<button
															id={`gift-${order.orderId}`}
															disabled={!order.giftMessage && true}
															onClick={() => {
																setIsGift(true);
																setMessage(order.giftMessage!);
																setMessageModal(true);
															}}
															className={classNames(
																order.giftMessage
																	? "bg-sage-orange hover:bg-secondary"
																	: "bg-slate-400",
																"  text-white rounded-md px-1 py-1 font-bold",
															)}
														>
															<Tooltip
																content="Hediye Mesajı"
																anchorSelect={`#gift-${order.orderId}`}
																place="right"
																offset={10}
																style={{
																	backgroundColor: "#87c484",
																	zIndex: 9999,
																}}
															/>
															<svg
																data-tooltip-offset={10}
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-5"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
																/>
															</svg>
														</button>
														<button
															id={`customer-${order.orderId}`}
															disabled={!order.customerNotes && true}
															onClick={() => {
																setIsGift(false);
																setMessage(order.customerNotes!);
																setMessageModal(true);
															}}
															className={classNames(
																order.customerNotes
																	? "bg-sage-orange hover:bg-secondary"
																	: "bg-slate-400",
																"  text-white rounded-md px-1 py-1 font-bold",
															)}
														>
															<Tooltip
																content="Müşteri Notu"
																style={{
																	backgroundColor: "#87c484",
																	zIndex: 9999,
																}}
																anchorSelect={`#customer-${order.orderId}`}
																place="right"
															/>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-5"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
																/>
															</svg>
														</button>
														<button
															id={`seller-${order.orderId}`}
															onClick={() => {
																openNoteModal(order);
															}}
															className={
																"bg-sage-orange hover:bg-secondary text-white rounded-md px-1 py-1 font-bold"
															}
														>
															<Tooltip
																style={{
																	backgroundColor: "#87c484",
																	zIndex: 9999,
																	opacity: 1,
																}}
																content="Not Ekle"
																place="right"
																anchorSelect={`#seller-${order.orderId}`}
															/>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-5"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
																/>
															</svg>
														</button>
													</div>
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-center text-xs font-medium sm:pr-6">
													<p>{order.shipTo?.name}</p>
													<p>
														{order.shipTo?.postalCode} - {order.shipTo?.country}
													</p>
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
													{!order.labelUrl ? (
														<>
															{/* biome-ignore lint/a11y/useKeyWithClickEvents: fix later */}
															<label
																htmlFor="label"
																onClick={() => {
																	setSelectedOrder(order);
																}}
																aria-disabled={
																	uploadLabelMutation.isPending &&
																	selectedOrder?._id === order._id
																}
																className="flex items-center gap-2 text-xs text-white bg-sage-orange rounded-md px-2 py-1 cursor-pointer"
															>
																<Upload className="size-4" />{" "}
																{uploadLabelMutation.isPending &&
																selectedOrder?._id === order._id
																	? "Yükleniyor..."
																	: "Label Yükle"}
															</label>
															<Input
																type="file"
																id="label"
																className="hidden"
																placeholder="Label yükle"
																onChange={async (e) => {
																	setSelectedOrder(order);
																	const file = e.target.files?.[0];
																	if (!file) return;

																	const formData = new FormData();
																	formData.append("file", file);

																	uploadLabelMutation.mutate(formData);
																}}
															/>
														</>
													) : (
														<Button
															variant="destructive"
															size={"sm"}
															className="py-1"
															disabled={
																deleteLabelMutation.isPending &&
																selectedOrder?._id === order._id
															}
															onClick={() => {
																setSelectedOrder(order);
																deleteLabelMutation.mutate(order._id);
															}}
														>
															{deleteLabelMutation.isPending &&
															selectedOrder?._id === order._id
																? "Siliniyor..."
																: "Label Sil"}
														</Button>
													)}
													{session.data?.user?.role === "ADMIN" &&
														order.labelUrl && (
															<a
																href={order.labelUrl}
																download={true}
																rel="noopener noreferrer"
																className="flex mt-2 items-center gap-2 text-xs text-white hover:bg-blue-700 cursor-pointer bg-blue-600 rounded-md px-2 py-1"
															>
																<Download className="size-4" />
																<p>Etiket İndir</p>
															</a>
														)}
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<div className="flex flex-col justify-center items-center gap-2">
														{session.data?.user?.role === "ADMIN" ? (
															<div className="flex flex-col justify-center items-center">
																<p>{getWarehouseLocation(order?.warehouse)}</p>
															</div>
														) : (
															<select
																onChange={(e) => handleWarehouse(e, order._id)}
																name="warehouse"
																id="warehouse"
																defaultValue={order?.warehouse}
																className="py-1 px-2 rounded-md border border-secondary"
															>
																<option value="">Ara depo seçiniz</option>
																<option value="shipEntegra">Almanya</option>
																<option value="kullanıcı">
																	Satıcı(Bana gelsin)
																</option>
															</select>
														)}

														{order.warehouseTrackingNumber && (
															<p className="text-xs">
																Takip No: {order.warehouseTrackingNumber}
															</p>
														)}
														{order.warehouseShippingService && (
															<p className="text-xs">
																Servis: {order.warehouseShippingService}
															</p>
														)}
														{session.data?.user?.role === "ADMIN" && (
															<Button
																size={"sm"}
																onClick={() => handleWareHouseModal(order)}
															>
																Kargo Bilgisi Gir
															</Button>
														)}
													</div>
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<p className="font-semibold">
														${" "}
														{order?.items.some((item) => item.matchId) &&
															order.items
																.reduce((acc, item) => {
																	const price = item?.matchedPrice || 0;
																	const quantity = item.quantity || 0;

																	return acc + price * quantity;
																}, 0)
																.toFixed(2)}
													</p>
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<div className="flex flex-col">
														{order.items.map((item) => {
															return (
																<div
																	className="flex flex-col justify-center items-center gap-2"
																	key={item.orderItemId}
																>
																	{item.designUrl && (
																		<div className="flex flex-col justify-center items-center gap-2">
																			<Image
																				onClick={() => {
																					if (item.designUrl) {
																						window.open(
																							item.designUrl,
																							"_blank",
																						);
																					}
																				}}
																				src={item.designUrl}
																				width={100}
																				height={100}
																				className="h-24 w-24 rounded-md cursor-pointer"
																				alt="design"
																			/>
																			<Button
																				variant="destructive"
																				size={"sm"}
																				disabled={
																					deleteImageMutation.isPending &&
																					selectedOrder?._id === order._id
																				}
																				onClick={() => {
																					setSelectedOrder(order);
																					const formData = new FormData();
																					formData.append("orderId", order._id);
																					formData.append(
																						"orderItemId",
																						item.orderItemId.toString(),
																					);
																					deleteImageMutation.mutate(formData);
																				}}
																			>
																				<Trash2 className="size-4" />
																				Sil
																			</Button>
																		</div>
																	)}
																	<div className=" flex justify-center items-center mt-2">
																		{/* biome-ignore lint/a11y/useKeyWithClickEvents: fix later */}
																		<label
																			htmlFor="image"
																			onClick={() => {
																				setSelectedOrder(order);
																			}}
																			aria-disabled={
																				uploadImageMutation.isPending
																			}
																			className="flex items-center gap-2 text-xs text-white bg-sage-orange rounded-md px-2 py-1 cursor-pointer"
																		>
																			<Upload className="size-4" />{" "}
																			{uploadImageMutation.isPending
																				? "Yükleniyor..."
																				: "Görsel Yükle"}
																		</label>
																		<Input
																			type="file"
																			id="image"
																			className="hidden"
																			placeholder="Görsel Yükle"
																			onChange={async (e) => {
																				const file = e.target.files?.[0];
																				if (!file) return;

																				const formData = new FormData();
																				formData.append("file", file);
																				formData.append("orderId", order._id);
																				formData.append(
																					"orderItemId",
																					item.orderItemId.toString(),
																				);

																				uploadImageMutation.mutate(formData);
																			}}
																		/>
																	</div>
																</div>
															);
														})}
													</div>
												</td>
												<td className="relative whitespace-nowrap py-1 pl-3 pr-4 text-sm font-medium sm:pr-6">
													<div className="w-full flex justify-center items-center gap-2">
														{order?.status === "waitingPayment" && (
															<button
																onClick={() => handlePayment(order)}
																className="bg-sage-blue text-white rounded-md px-4 py-1 font-bold"
															>
																Ödeme Yap
															</button>
														)}
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<Pagination totalPages={totalPages} />
			<CustomerNotesModal
				isGift={isGift}
				message={message}
				isModalOpen={messageModal}
				setIsModalOpen={setMessageModal}
			/>
			<AddNoteModal
				isModalOpen={noteModalOpen}
				setIsModalOpen={setNoteModalOpen}
				selectedOrder={selectedOrder!}
			/>

			<ConfirmStatusChange
				open={confirmStatusChangeOpen}
				onClose={onClose}
				status={selectedStatus}
				isAllSelected={isAllSelected}
				orderIds={selectedOrderIds}
			/>
			{selectedOrder && (
				<PaymentModal
					order={selectedOrder!}
					onClose={closePaymentModal}
					open={paymentModalOpen}
				/>
			)}
			<WarehouseModal
				isWarehouseModalOpen={isWarehouseModalOpen}
				setIsWarehouseModalOpen={setIsWarehouseModalOpen}
				order={selectedOrder!}
			/>
		</div>
	);
};

export default SellerOrdersTable;

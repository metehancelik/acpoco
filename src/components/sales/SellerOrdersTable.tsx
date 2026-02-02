import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
	Calendar,
	Download,
	Gift,
	MapPin,
	MessageSquare,
	Package,
	PenLine,
	Store,
	Trash2,
	Upload,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";
import { Tooltip } from "react-tooltip";

import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import { getWarehouseLocation } from "@/lib/utils";
import type { IProduct } from "@/models/Product";
import AlertNotification from "@/utils/alertNotification";
import { classNames } from "@/utils/classNames";
import httpClient from "@/utils/httpClient";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

import Pagination from "../shared/Pagination";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AddNoteModal from "./AddNoteModal";
import ConfirmStatusChange from "./ConfirmStatusChange";
import CustomerNotesModal from "./CustomerNotesModal";
import { MatchCard } from "./MatchCard";
import PaymentModal from "./PaymentModal";
import WarehouseModal from "./WarehouseModal";

type Props = {
	data: (OrderWithPopulatedItems & {
		_id: string;
		warehouse: string;
		labelUrl: string;
		warehousePrice?: number;
		warehouseTrackingNumber?: string;
		warehouseShippingService?: string;
	})[];
	totalPages: number;
	selectedOrderIds: string[];
	setSelectedOrderIds: React.Dispatch<React.SetStateAction<string[]>>;
	confirmStatusChangeOpen: boolean;
	setConfirmStatusChangeOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedStatus: string;
	setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
};

const SellerOrdersTable: React.FC<Props> = ({
	data,
	totalPages,
	selectedOrderIds,
	setSelectedOrderIds,
	confirmStatusChangeOpen,
	setConfirmStatusChangeOpen,
	selectedStatus,
	setSelectedStatus,
}) => {
	const t = useTranslations("Orders");
	const tMonths = useTranslations("Months");
	const session = useSession();
	const queryClient = useQueryClient();

	const formatDateLocalized = (dateString: string) => {
		const monthKeys = [
			"january",
			"february",
			"march",
			"april",
			"may",
			"june",
			"july",
			"august",
			"september",
			"october",
			"november",
			"december",
		] as const;

		const date = new Date(dateString);
		const day = date.getUTCDate().toString().padStart(2, "0");
		const month = tMonths(monthKeys[date.getUTCMonth()]);
		const year = date.getUTCFullYear();
		const hour = date.getUTCHours().toString().padStart(2, "0");
		const minute = date.getUTCMinutes().toString().padStart(2, "0");

		return `${day} ${month} ${year} - ${hour}:${minute}`;
	};

	const [noteModalOpen, setNoteModalOpen] = React.useState(false);
	const [messageModal, setMessageModal] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [isGift, setIsGift] = React.useState(false);
	const [isAllSelected, setIsAllSelected] = React.useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
	const [isWarehouseModalOpen, setIsWarehouseModalOpen] = React.useState(false);
	const [selectedOrder, setSelectedOrder] = React.useState<
		| (OrderWithPopulatedItems & {
				_id: string;
				warehousePrice?: number;
				warehouseTrackingNumber?: string;
				warehouseShippingService?: string;
		  })
		| null
	>(null);

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

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "waitingMatch":
				return t("waitingMatchStatus");
			case "waitingPayment":
				return t("waitingPaymentStatus");
			case "waitingProduction":
				return t("waitingProductionStatus");
			case "processing":
				return t("processingStatus");
			case "shipped":
				return t("shippedStatus");
			default:
				return status;
		}
	};

	const renderStatus = (status: string) => {
		const statusConfig: Record<
			string,
			{ bg: string; text: string; icon: string; glow: string }
		> = {
			waitingMatch: {
				bg: "bg-linear-to-r from-orange-500 to-orange-600",
				text: "text-white",
				icon: "🔍",
				glow: "shadow-orange-200",
			},
			waitingPayment: {
				bg: "bg-linear-to-r from-indigo-500 to-purple-600",
				text: "text-white",
				icon: "💳",
				glow: "shadow-indigo-200",
			},
			waitingProduction: {
				bg: "bg-linear-to-r from-amber-500 to-yellow-500",
				text: "text-white",
				icon: "⏳",
				glow: "shadow-amber-200",
			},
			processing: {
				bg: "bg-linear-to-r from-blue-500 to-cyan-500",
				text: "text-white",
				icon: "🔧",
				glow: "shadow-blue-200",
			},
			shipped: {
				bg: "bg-linear-to-r from-emerald-500 to-green-500",
				text: "text-white",
				icon: "✓",
				glow: "shadow-emerald-200",
			},
		};

		const config = statusConfig[status] || {
			bg: "bg-gray-500",
			text: "text-white",
			icon: "•",
			glow: "",
		};

		return (
			<span
				className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${config.bg} ${config.text} shadow-sm ${config.glow}`}
			>
				<span>{config.icon}</span>
				{getStatusLabel(status)}
			</span>
		);
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
			AlertNotification(t("labelUploadError"), "error");
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
			AlertNotification(t("labelDeleteError"), "error");
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
			AlertNotification(t("imageUploadError"), "error");
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
			AlertNotification(t("imageDeleteError"), "error");
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
			AlertNotification(t("warehouseUpdateError"), "error");
		},
	});

	const searchParams = useSearchParams();
	const currentStatus = searchParams?.get("status");

	const getEmptyMessage = () => {
		switch (currentStatus) {
			case "waitingProduction":
				return t("noOrdersWaitingProduction");
			case "processing":
				return t("noOrdersInProduction");
			case "shipped":
				return t("noShippedOrders");
			default:
				return t("noPendingOrders");
		}
	};

	const handleWarehouse = (
		e: React.ChangeEvent<HTMLSelectElement>,
		orderId: string,
	) => {
		updateWarehouseMutation.mutate({ warehouse: e.target.value, orderId });
	};

	return (
		<div className="h-full flex flex-col bg-linear-to-b from-slate-50 to-white overflow-hidden">
			{/* Table - fills remaining space */}
			<div className="flex-1 min-h-0 overflow-auto">
				<table className="min-w-full">
					<thead className="bg-linear-to-r from-slate-800 to-slate-700">
						<tr>
							<th
								scope="col"
								className="py-2 pl-3 pr-1 text-left text-[11px] font-semibold text-slate-200 uppercase"
							>
								<div className="flex items-center gap-1.5">
									{session.data?.user?.role === "ADMIN" && (
										<input
											type="checkbox"
											checked={isAllSelected}
											className="h-4 w-4 rounded border-slate-500 bg-slate-600 text-primary focus:ring-primary"
											onChange={() => {
												setIsAllSelected(!isAllSelected);
												if (!isAllSelected) {
													setSelectedOrderIds(data.map((order) => order._id));
												} else {
													setSelectedOrderIds([]);
												}
											}}
										/>
									)}
									<span>{t("status")}</span>
								</div>
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-left text-[11px] font-semibold text-slate-200 uppercase"
							>
								<div className="flex items-center gap-1">
									<Store className="h-3.5 w-3.5" />
									{t("storeName")}
								</div>
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-left text-[11px] font-semibold text-slate-200 uppercase"
							>
								<div className="flex items-center gap-1">
									<Calendar className="h-3.5 w-3.5" />
									{t("dates")}
								</div>
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-left text-[11px] font-semibold text-slate-200 uppercase"
							>
								<div className="flex items-center gap-1">
									<Package className="h-3.5 w-3.5" />
									{t("productInfo")}
								</div>
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								{t("match")}
							</th>
							<th
								scope="col"
								className="px-1 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase w-10"
							>
								<MessageSquare className="h-3.5 w-3.5 mx-auto" />
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								<div className="flex items-center justify-center gap-1">
									<MapPin className="h-3.5 w-3.5" />
									{t("address")}
								</div>
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								{t("warehouse")}
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								{t("price")}
							</th>
							<th
								scope="col"
								className="px-2 py-2 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								{t("design")}
							</th>
							<th
								scope="col"
								className="py-2 pl-1 pr-3 text-center text-[11px] font-semibold text-slate-200 uppercase"
							>
								{t("actions")}
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{data && data.length === 0 ? (
							<tr>
								<td colSpan={11} className="text-center py-16">
									<div className="flex flex-col items-center gap-3">
										<Package className="h-12 w-12 text-slate-300" />
										<p className="text-slate-500 font-medium">
											{getEmptyMessage()}
										</p>
									</div>
								</td>
							</tr>
						) : (
							[...data]
								.sort(
									(a, b) =>
										new Date(b.orderDate).getTime() -
										new Date(a.orderDate).getTime(),
								)
								.map((order, index) => (
									<tr
										key={order.orderId}
										className={`group transition-all duration-200 hover:bg-primary/5 ${
											index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
										}`}
									>
										{/* Status */}
										<td className="whitespace-nowrap py-1.5 pl-3 pr-1">
											<div className="flex items-center gap-1.5">
												{session.data?.user?.role === "ADMIN" && (
													<input
														type="checkbox"
														className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
														checked={selectedOrderIds.includes(order._id)}
														onChange={() => toggleOrder(order._id)}
													/>
												)}
												{renderStatus(order.status)}
											</div>
										</td>

										{/* Store Name + Order ID */}
										<td className="whitespace-nowrap px-2 py-1.5">
											<p className="font-semibold text-slate-800 text-xs">
												{order.advancedOptions.storeId.storeName}
											</p>
											<p className="text-[10px] text-slate-400 font-mono">
												#{order.orderId}
											</p>
										</td>

										{/* Dates */}
										<td className="px-2 py-1.5">
											<div className="space-y-0.5">
												<div className="flex items-center gap-1">
													<span className="text-[10px] text-slate-400">O:</span>
													<span className="text-[11px] font-medium text-slate-700">
														{
															formatDateLocalized(order.orderDate).split(
																" - ",
															)[0]
														}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<span className="text-[10px] text-slate-400">D:</span>
													<span className="text-[11px] font-medium text-slate-700">
														{
															formatDateLocalized(order.shipByDate).split(
																" - ",
															)[0]
														}
													</span>
												</div>
											</div>
										</td>

										{/* Product Info */}
										<td className="px-2 py-1.5 max-w-[280px]">
											{(
												order.items as Array<
													Omit<
														OrderWithPopulatedItems["items"][0],
														"matchId"
													> & {
														matchId?: IProduct;
													}
												>
											).map((item) => (
												<div
													key={item.orderItemId}
													className="flex items-stretch gap-2 mb-1.5 last:mb-0"
												>
													{/* Product Image */}
													<div className="relative self-stretch mr-1">
														<Image
															src={normalizeImageSrc(item.imageUrl!)}
															alt={item.sku}
															width={90}
															height={120}
															className="w-[90px] h-full min-h-[70px] object-cover rounded-lg border border-slate-200"
														/>
														<span className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[9px] font-bold px-1 rounded">
															x{item.quantity}
														</span>
													</div>

													{/* Product Details */}
													<div className="flex-1 min-w-0 max-w-[180px]">
														{/* Options */}
														<div className="text-[10px] text-slate-600 mt-0.5 space-y-0.5">
															{item.amazonCustomizationOptions &&
															item.amazonCustomizationOptions.length > 0
																? item.amazonCustomizationOptions
																		.slice(0, 6)
																		.map((opt, i) => (
																			<p key={i} className="truncate">
																				<span className="text-slate-400">
																					{opt.label}:
																				</span>{" "}
																				{opt.option}
																			</p>
																		))
																: item.options.slice(0, 5).map((option) => (
																		<p
																			key={`${item.orderItemId}-${option.name}`}
																			className="truncate"
																		>
																			<span className="text-slate-400">
																				{option.name}:
																			</span>{" "}
																			{option.value}
																		</p>
																	))}
														</div>
													</div>
												</div>
											))}
										</td>

										{/* Match */}
										<td className="px-2 py-1.5">
											<div className="flex flex-col items-center gap-1">
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
													const matchTitle = (
														item.matchId as { productId?: { title?: string } }
													)?.productId?.title;
													return (
														<div
															key={item.orderItemId}
															className="mb-1 last:mb-0 flex flex-col justify-center items-center gap-1"
														>
															<p className="text-[10px] font-mono text-slate-600 truncate">
																{item.sku}
															</p>
															{item.matchId ? (
																<div className="flex flex-col items-center gap-0.5 text-center max-w-[140px]">
																	<span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
																		✓ Matched
																	</span>
																	{matchTitle && (
																		<span
																			className="text-[10px] text-slate-600 truncate w-full"
																			title={matchTitle}
																		>
																			{matchTitle}
																		</span>
																	)}
																</div>
															) : (
																<MatchCard
																	orderId={order._id}
																	orderItem={item}
																	orderStatus={order.status}
																/>
															)}
														</div>
													);
												})}
											</div>
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

										{/* Notes */}
										<td className="px-1 py-1.5">
											<div className="flex flex-col gap-0.5 items-center">
												<button
													id={`gift-${order.orderId}`}
													disabled={!order.giftMessage}
													onClick={() => {
														setIsGift(true);
														setMessage(order.giftMessage!);
														setMessageModal(true);
													}}
													className={classNames(
														order.giftMessage
															? "bg-pink-500 text-white"
															: "bg-slate-100 text-slate-300",
														"rounded p-1.5 transition-all",
													)}
												>
													<Tooltip
														content={t("giftMessage")}
														anchorSelect={`#gift-${order.orderId}`}
														place="top"
														offset={4}
														style={{
															backgroundColor: "#1e293b",
															borderRadius: "6px",
															fontSize: "11px",
															zIndex: 9999,
														}}
													/>
													<Gift className="h-3.5 w-3.5" />
												</button>
												<button
													id={`customer-${order.orderId}`}
													disabled={!order.customerNotes}
													onClick={() => {
														setIsGift(false);
														setMessage(order.customerNotes!);
														setMessageModal(true);
													}}
													className={classNames(
														order.customerNotes
															? "bg-blue-500 text-white"
															: "bg-slate-100 text-slate-300",
														"rounded p-1.5 transition-all",
													)}
												>
													<Tooltip
														content={t("customerNote")}
														style={{
															backgroundColor: "#1e293b",
															borderRadius: "6px",
															fontSize: "11px",
															zIndex: 9999,
														}}
														anchorSelect={`#customer-${order.orderId}`}
														place="top"
													/>
													<MessageSquare className="h-3.5 w-3.5" />
												</button>
												<button
													id={`seller-${order.orderId}`}
													onClick={() => openNoteModal(order)}
													className="bg-amber-500 text-white rounded p-1.5 transition-all"
												>
													<Tooltip
														style={{
															backgroundColor: "#1e293b",
															borderRadius: "6px",
															fontSize: "11px",
															zIndex: 9999,
														}}
														content={t("addNote")}
														place="top"
														anchorSelect={`#seller-${order.orderId}`}
													/>
													<PenLine className="h-3.5 w-3.5" />
												</button>
											</div>
										</td>

										{/* Address + Label */}
										<td className="px-2 py-1.5">
											<div className="flex flex-col items-center gap-0.5">
												<p className="text-[11px] font-medium text-slate-700 truncate max-w-[110px]">
													{order.shipTo?.name}
												</p>
												<p className="text-[10px] text-slate-400">
													{order.shipTo?.postalCode}, {order.shipTo?.country}
												</p>
												{/* Label */}
												{!order.labelUrl ? (
													<>
														{/* biome-ignore lint/a11y/useKeyWithClickEvents: fix later */}
														<label
															htmlFor="label"
															onClick={() => setSelectedOrder(order)}
															aria-disabled={
																uploadLabelMutation.isPending &&
																selectedOrder?._id === order._id
															}
															className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 cursor-pointer hover:bg-orange-100 flex items-center gap-1 mt-0.5"
														>
															<Upload className="h-3 w-3" />
															Label
														</label>
														<Input
															type="file"
															id="label"
															className="hidden"
															placeholder={t("uploadLabel")}
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
													<div className="flex items-center gap-1 mt-0.5">
														{session.data?.user?.role === "ADMIN" && (
															<a
																href={order.labelUrl}
																download={true}
																rel="noopener noreferrer"
																className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 hover:bg-blue-100"
															>
																<Download className="h-3 w-3 inline" />
															</a>
														)}
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-1.5 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50"
															disabled={
																deleteLabelMutation.isPending &&
																selectedOrder?._id === order._id
															}
															onClick={() => {
																setSelectedOrder(order);
																deleteLabelMutation.mutate(order._id);
															}}
														>
															<Trash2 className="h-3 w-3" />
														</Button>
													</div>
												)}
											</div>
										</td>

										{/* Warehouse */}
										<td className="px-2 py-1.5">
											<div className="flex flex-col items-center gap-0.5">
												{session.data?.user?.role === "ADMIN" ? (
													<>
														<span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded font-medium">
															{getWarehouseLocation(order?.warehouse) || "—"}
														</span>
														{order.warehouseTrackingNumber && (
															<p className="text-[10px] text-slate-400 truncate max-w-[90px]">
																{order.warehouseTrackingNumber}
															</p>
														)}
														<Button
															size="sm"
															variant="outline"
															className="text-[10px] h-6 px-2"
															onClick={() => handleWareHouseModal(order)}
														>
															+ Info
														</Button>
													</>
												) : (
													<select
														onChange={(e) => handleWarehouse(e, order._id)}
														name="warehouse"
														id="warehouse"
														defaultValue={order?.warehouse}
														className="text-[11px] py-1.5 px-2 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-primary/30"
													>
														<option value="">{t("selectWarehouse")}</option>
														<option value="shipEntegra">{t("germany")}</option>
														<option value="kullanıcı">
															{t("sellerSendToMe")}
														</option>
													</select>
												)}
											</div>
										</td>

										{/* Price */}
										<td className="px-2 py-1.5 text-center">
											{order?.items.some((item) => item.matchId) ? (
												<div className="flex flex-col items-center gap-0.5">
													<span className="text-emerald-600 font-bold text-base">
														€
														{order.items
															.reduce((acc, item) => {
																const price = item?.matchedPrice || 0;
																const quantity = item.quantity || 0;
																return acc + price * quantity;
															}, 0)
															.toFixed(2)}
													</span>
													{order.warehousePrice != null &&
														Number(order.warehousePrice) > 0 && (
															<span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
																{t("warehouseCost")}: €
																{Number(order.warehousePrice).toFixed(2)}
															</span>
														)}
													{order.shippingAmount != null &&
														Number(order.shippingAmount) > 0 && (
															<span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
																{t("shippingCost")}: €
																{Number(order.shippingAmount).toFixed(2)}
															</span>
														)}
												</div>
											) : (
												<span className="text-slate-300 text-sm">—</span>
											)}
										</td>

										{/* Design */}
										<td className="px-2 py-1.5">
											<div className="flex flex-col items-center gap-1">
												{order.items.map((item) => (
													<div
														className="flex items-center gap-1"
														key={item.orderItemId}
													>
														{item.designUrl ? (
															<div className="relative group/img">
																<Image
																	onClick={() =>
																		item.designUrl &&
																		window.open(item.designUrl, "_blank")
																	}
																	src={item.designUrl}
																	width={52}
																	height={52}
																	className="w-13 h-13 rounded cursor-pointer border border-slate-200 object-cover hover:border-primary transition-colors"
																	alt="design"
																/>
																<Button
																	variant="destructive"
																	size="sm"
																	className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
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
																	<Trash2 className="h-2.5 w-2.5" />
																</Button>
															</div>
														) : (
															/* biome-ignore lint/a11y/useKeyWithClickEvents: fix later */
															<label
																htmlFor="image"
																onClick={() => setSelectedOrder(order)}
																aria-disabled={uploadImageMutation.isPending}
																className="text-[10px] text-violet-600 bg-violet-50 border border-violet-200 rounded px-2 py-1 cursor-pointer hover:bg-violet-100 flex items-center gap-1"
															>
																<Upload className="h-3 w-3" />
																Upload
															</label>
														)}
														<Input
															type="file"
															id="image"
															className="hidden"
															placeholder={t("uploadImage")}
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
												))}
											</div>
										</td>

										{/* Actions */}
										<td className="px-1 py-1.5 text-center">
											{order?.status === "waitingPayment" && (
												<button
													onClick={() => handlePayment(order)}
													className="bg-indigo-500 text-white rounded px-3 py-1.5 font-medium text-[11px] hover:bg-indigo-600 transition-all"
												>
													{t("makePayment")}
												</button>
											)}
										</td>
									</tr>
								))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="shrink-0 h-11 px-4 border-t border-slate-200/60 bg-linear-to-r from-slate-800 via-slate-700 to-slate-800 flex items-center justify-between">
				<div className="text-[10px] text-slate-400 font-medium tracking-wide">
					<span className="text-white font-semibold">{data?.length || 0}</span>{" "}
					{t("ordersShown")}
				</div>
				<Pagination totalPages={totalPages} />
				<div className="text-[10px] text-slate-400 font-medium tracking-wide">
					<span className="text-white font-semibold">{totalPages}</span>{" "}
					{t("pages")}
				</div>
			</div>
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

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import FilterForm from "@/components/sales/FilterForm";
import SellerOrdersTable from "@/components/sales/SellerOrdersTable";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import AlertNotification from "@/utils/alertNotification";

export default function AdminSalesPage() {
	const t = useTranslations("Orders");
	const tCommon = useTranslations("Common");
	const searchParams = useSearchParams();
	const session = useSession();
	const queryClient = useQueryClient();

	const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
	const [confirmStatusChangeOpen, setConfirmStatusChangeOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [isPrinting, setIsPrinting] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ["orders", searchParams?.toString()],
		queryFn: async () => {
			const res = await axios.get(
				`/api/orders?view=print&page=${searchParams?.get("page") || 1}&${searchParams?.toString()}`,
			);

			return res.data;
		},
	});

	if (error) {
		AlertNotification(t("errorFetchingOrders"), "error");
	}

	const handlePrint = async () => {
		try {
			setIsPrinting(true);
			AlertNotification(t("generatingPdf"), "info");

			let response: Response;

			if (selectedOrderIds && selectedOrderIds.length > 0) {
				response = await fetch("/api/orders/pdf", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ orderIds: selectedOrderIds }),
				});
			} else {
				const currentSearchParams = new URLSearchParams(
					searchParams?.toString() || "",
				);
				response = await fetch(
					`/api/orders/pdf?${currentSearchParams.toString()}`,
				);
			}

			if (!response.ok) {
				throw new Error(`Failed to generate PDF: ${response.status}`);
			}

			const blob = await response.blob();
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.href = url;
			link.download = selectedOrderIds?.length
				? "selected_orders.pdf"
				: "order_items.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			AlertNotification(t("pdfGenerated"), "success");
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		} catch (err) {
			console.error("PDF generation error:", err);
			AlertNotification(t("errorGeneratingPdf"), "error");
		} finally {
			setIsPrinting(false);
		}
	};

	const isAdmin = session.data?.user?.role === "ADMIN";

	return (
		<div className="fixed inset-x-0 top-20 bottom-0 flex flex-col bg-slate-50">
			{/* Filter Bar with Action Buttons */}
			<div className="shrink-0 bg-white border-b shadow-sm px-3 py-2 relative z-50 overflow-visible">
				<div className="flex items-center gap-3 justify-between">
					{/* Action Buttons - Left side */}
					{isAdmin && (
						<div className="flex items-center gap-2 shrink-0">
							<Select
								disabled={selectedOrderIds.length === 0}
								onValueChange={(value) => {
									setSelectedStatus(value);
									setConfirmStatusChangeOpen(true);
								}}
							>
								<SelectTrigger className="bg-sage-blue text-white w-[160px] h-8 text-xs border-0">
									<SelectValue placeholder={t("changeStatus")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="waitingProduction">
										{t("waitingProductionStatus")}
									</SelectItem>
									<SelectItem value="shipped">{t("shippedStatus")}</SelectItem>
								</SelectContent>
							</Select>

							<Button
								onClick={handlePrint}
								size="sm"
								className="bg-primary text-white hover:bg-primary/90 h-8 text-xs px-3"
								disabled={isPrinting || !data}
							>
								<Printer className="h-3 w-3 mr-1" />
								{t("printOrders")}
							</Button>

							{selectedOrderIds.length > 0 && (
								<span className="text-[10px] text-muted-foreground bg-slate-100 border px-1.5 py-0.5 rounded">
									{selectedOrderIds.length} {t("selected")}
								</span>
							)}
						</div>
					)}

					{/* Filter - Right side */}
					<FilterForm />
				</div>
			</div>

			{/* Table takes remaining space */}
			<div className="flex-1 min-h-0 relative z-0">
				{isLoading ? (
					<div className="flex flex-col justify-center items-center h-full gap-2">
						<Loader2 className="w-6 h-6 animate-spin text-primary" />
						<p className="text-xs text-muted-foreground">
							{tCommon("loading")}
						</p>
					</div>
				) : (
					<div id="orders-table-container" className="h-full">
						<SellerOrdersTable
							data={data?.orders}
							totalPages={data?.totalPages}
							selectedOrderIds={selectedOrderIds}
							setSelectedOrderIds={setSelectedOrderIds}
							confirmStatusChangeOpen={confirmStatusChangeOpen}
							setConfirmStatusChangeOpen={setConfirmStatusChangeOpen}
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

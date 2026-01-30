"use client";

import axios from "axios";
import { format, parse } from "date-fns";
import { tr } from "date-fns/locale";
import {
	Calendar,
	ChevronDown,
	Filter,
	MapPin,
	Package,
	Search,
	Store,
	X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { DateRange, type Range, type RangeKeyDict } from "react-date-range";
import { Controller, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const COUNTRIES = [
	{ code: "AU", name: "Australia - AU" },
	{ code: "AT", name: "Austria - AT" },
	{ code: "BE", name: "Belgium - BE" },
	{ code: "BG", name: "Bulgaria - BG" },
	{ code: "CA", name: "Canada - CA" },
	{ code: "HR", name: "Croatia - HR" },
	{ code: "CY", name: "Cyprus - CY" },
	{ code: "CZ", name: "Czech Republic - CZ" },
	{ code: "DK", name: "Denmark - DK" },
	{ code: "EE", name: "Estonia - EE" },
	{ code: "FI", name: "Finland - FI" },
	{ code: "FR", name: "France - FR" },
	{ code: "DE", name: "Germany - DE" },
	{ code: "GR", name: "Greece - GR" },
	{ code: "HK", name: "Hong Kong - HK" },
	{ code: "HU", name: "Hungary - HU" },
	{ code: "IN", name: "India - IN" },
	{ code: "ID", name: "Indonesia - ID" },
	{ code: "IE", name: "Ireland - IE" },
	{ code: "IL", name: "Israel - IL" },
	{ code: "IT", name: "Italy - IT" },
	{ code: "LV", name: "Latvia - LV" },
	{ code: "LT", name: "Lithuania - LT" },
	{ code: "LU", name: "Luxembourg - LU" },
	{ code: "MY", name: "Malaysia - MY" },
	{ code: "MT", name: "Malta - MT" },
	{ code: "MX", name: "Mexico - MX" },
	{ code: "MA", name: "Morocco - MA" },
	{ code: "NL", name: "Netherlands - NL" },
	{ code: "NZ", name: "New Zealand - NZ" },
	{ code: "NO", name: "Norway - NO" },
	{ code: "PH", name: "Philippines - PH" },
	{ code: "PL", name: "Poland - PL" },
	{ code: "PT", name: "Portugal - PT" },
	{ code: "RO", name: "Romania - RO" },
	{ code: "SG", name: "Singapore - SG" },
	{ code: "SK", name: "Slovakia - SK" },
	{ code: "SI", name: "Slovenia - SI" },
	{ code: "ZA", name: "South Africa - ZA" },
	{ code: "ES", name: "Spain - ES" },
	{ code: "SE", name: "Sweden - SE" },
	{ code: "CH", name: "Switzerland - CH" },
	{ code: "TR", name: "Türkiye - TR" },
	{ code: "GB", name: "United Kingdom - GB" },
	{ code: "US", name: "United States - US" },
	{ code: "VN", name: "Vietnam - VN" },
];

const WAREHOUSES = [
	{ code: "DE", name: "Almanya - DE" },
	{ code: "GB", name: "İngiltere - GB" },
	{ code: "US", name: "Amerika - US" },
	{ code: "CA", name: "Kanada - CA" },
];

type Inputs = {
	storeId: string;
	status: string;
	orderId: string;
	warehouse: string;
	country: string;
};

const FilterForm = () => {
	const t = useTranslations("Orders");
	const session = useSession();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Parse dates from URL
	const getInitialDateRange = (): Range[] => {
		const startDateStr = searchParams?.get("orderDateStart");
		const endDateStr = searchParams?.get("orderDateEnd");

		if (startDateStr || endDateStr) {
			return [
				{
					startDate: startDateStr
						? parse(startDateStr, "yyyy-MM-dd", new Date())
						: undefined,
					endDate: endDateStr
						? parse(endDateStr, "yyyy-MM-dd", new Date())
						: undefined,
					key: "selection",
				},
			];
		}
		return [{ startDate: undefined, endDate: undefined, key: "selection" }];
	};

	const [stores, setStores] = useState<
		{ storeId: string; storeName: string }[]
	>([]);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [dateRange, setDateRange] = useState<Range[]>(getInitialDateRange);
	const dateRangeRef = useRef<Range[]>(getInitialDateRange());
	const calendarRef = useRef<HTMLDivElement>(null);

	const { handleSubmit, control, reset } = useForm<Inputs>({
		defaultValues: {
			storeId: searchParams?.get("storeId") || "",
			status: searchParams?.get("status") || "",
			country: searchParams?.get("country") || "",
			warehouse: searchParams?.get("warehouse") || "",
			orderId: searchParams?.get("orderId") || "",
		},
	});

	// Sync form with URL params when they change
	useEffect(() => {
		reset({
			storeId: searchParams?.get("storeId") || "",
			status: searchParams?.get("status") || "",
			country: searchParams?.get("country") || "",
			warehouse: searchParams?.get("warehouse") || "",
			orderId: searchParams?.get("orderId") || "",
		});
		const newDateRange = getInitialDateRange();
		setDateRange(newDateRange);
		dateRangeRef.current = newDateRange;
	}, [searchParams, reset]);

	// Close calendar when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setIsCalendarOpen(false);
			}
		};

		if (isCalendarOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isCalendarOpen]);

	const onSubmit = (data: Inputs) => {
		const searchParams = new URLSearchParams();
		const currentDateRange = dateRangeRef.current;

		if (data.storeId) searchParams.append("storeId", data.storeId);
		if (currentDateRange[0]?.startDate) {
			searchParams.append(
				"orderDateStart",
				format(currentDateRange[0].startDate, "yyyy-MM-dd"),
			);
		}
		if (currentDateRange[0]?.endDate) {
			searchParams.append(
				"orderDateEnd",
				format(currentDateRange[0].endDate, "yyyy-MM-dd"),
			);
		}
		if (data.status) searchParams.append("status", data.status);
		if (data.orderId) searchParams.append("orderId", data.orderId);
		if (data.warehouse) searchParams.append("warehouse", data.warehouse);
		if (data.country) searchParams.append("country", data.country);

		const queryString = searchParams.toString();
		router.push(`${pathname}?${queryString}`);
	};

	useEffect(() => {
		const getStores = async () => {
			try {
				const res = await axios.get("/api/stores/mystores");
				setStores(res.data.stores);
			} catch (error: unknown) {
				console.error(error);
			}
		};
		getStores();
	}, []);

	const handleDateChange = (item: RangeKeyDict) => {
		const newRange = [item.selection];
		setDateRange(newRange);
		dateRangeRef.current = newRange;
	};

	const formatDateDisplay = () => {
		const { startDate, endDate } = dateRange[0];
		if (!startDate) return null;

		if (endDate && startDate.getTime() !== endDate.getTime()) {
			return `${format(startDate, "dd MMM", { locale: tr })} - ${format(endDate, "dd MMM", { locale: tr })}`;
		}
		return format(startDate, "dd MMM yyyy", { locale: tr });
	};

	const clearDates = () => {
		const newRange = [
			{
				startDate: undefined,
				endDate: undefined,
				key: "selection",
			},
		];
		setDateRange(newRange);
		dateRangeRef.current = newRange;
	};

	const setPresetRange = (days: number) => {
		const end = new Date();
		const start = new Date();
		start.setDate(end.getDate() - days);
		const newRange = [
			{
				startDate: start,
				endDate: end,
				key: "selection",
			},
		];
		setDateRange(newRange);
		dateRangeRef.current = newRange;
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="relative flex items-center gap-1"
		>
			{/* Glassmorphism container */}
			<div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl rounded-xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
				{/* Status */}
				<div className="group relative">
					<div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					<Controller
						control={control}
						name="status"
						render={({ field }) => (
							<select
								{...field}
								className="relative h-8 text-[10px] font-semibold rounded-lg bg-slate-50/80 border border-slate-200/50 pl-2 pr-6 text-slate-700 focus:ring-1 focus:ring-violet-500/30 focus:border-violet-400 appearance-none cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150"
							>
								<option value="">📊 {t("all")}</option>
								{session.data?.user?.role !== "ADMIN" && (
									<>
										<option value="waitingMatch">🔍 {t("waitingMatch")}</option>
										<option value="waitingPayment">
											💳 {t("waitingPayment")}
										</option>
										<option value="waitingProduction">
											⚙️ {t("processing")}
										</option>
										<option value="shipped">🚚 {t("shipped")}</option>
									</>
								)}
								{session.data?.user?.role === "ADMIN" && (
									<>
										<option value="waitingProduction">
											⚙️ {t("processing")}
										</option>
										<option value="shipped">🚚 {t("shipped")}</option>
									</>
								)}
							</select>
						)}
					/>
					<ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-400 pointer-events-none" />
				</div>

				{/* Store */}
				<div className="group relative">
					<div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					<Store className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-500 z-10" />
					<Controller
						control={control}
						name="storeId"
						render={({ field }) => (
							<select
								{...field}
								className="relative h-8 text-[10px] font-semibold rounded-lg bg-slate-50/80 border border-slate-200/50 pl-7 pr-6 text-slate-700 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 appearance-none cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150"
							>
								<option value="">{t("store")}</option>
								{stores.map((store) => (
									<option key={store.storeId} value={store.storeId}>
										{store.storeName}
									</option>
								))}
							</select>
						)}
					/>
					<ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-400 pointer-events-none" />
				</div>

				{/* Country */}
				<div className="group relative">
					<div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					<MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-500 z-10" />
					<Controller
						control={control}
						name="country"
						render={({ field }) => (
							<select
								{...field}
								className="relative h-8 text-[10px] font-semibold rounded-lg bg-slate-50/80 border border-slate-200/50 pl-7 pr-6 text-slate-700 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-400 appearance-none cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150"
							>
								<option value="">{t("country")}</option>
								{COUNTRIES.map((country) => (
									<option key={country.code} value={country.code}>
										{country.name}
									</option>
								))}
							</select>
						)}
					/>
					<ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-400 pointer-events-none" />
				</div>

				{/* Warehouse */}
				<div className="group relative">
					<div className="absolute inset-0 bg-linear-to-r from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					<Package className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-500 z-10" />
					<Controller
						control={control}
						name="warehouse"
						render={({ field }) => (
							<select
								{...field}
								className="relative h-8 text-[10px] font-semibold rounded-lg bg-slate-50/80 border border-slate-200/50 pl-7 pr-6 text-slate-700 focus:ring-1 focus:ring-amber-500/30 focus:border-amber-400 appearance-none cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150"
							>
								<option value="">{t("warehouse")}</option>
								{WAREHOUSES.map((warehouse) => (
									<option key={warehouse.code} value={warehouse.code}>
										{warehouse.name}
									</option>
								))}
							</select>
						)}
					/>
					<ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-400 pointer-events-none" />
				</div>

				{/* Order Search */}
				<div className="group relative">
					<div className="absolute inset-0 bg-linear-to-r from-pink-500/20 to-rose-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-pink-500 z-10" />
					<Controller
						control={control}
						name="orderId"
						render={({ field }) => (
							<input
								{...field}
								placeholder={`# ${t("orderNo")}`}
								className="relative h-8 w-24 text-[10px] font-semibold rounded-lg bg-slate-50/80 border border-slate-200/50 pl-7 pr-2 text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-pink-500/30 focus:border-pink-400 hover:bg-white hover:shadow-sm transition-all duration-150"
							/>
						)}
					/>
				</div>

				{/* Date Picker */}
				<div className="relative" ref={calendarRef}>
					<button
						type="button"
						onClick={() => setIsCalendarOpen(!isCalendarOpen)}
						className={cn(
							"h-8 px-3 flex items-center gap-1.5 rounded-xl font-semibold text-[10px] transition-all duration-200",
							"bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25",
							"hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]",
							dateRange[0].startDate && "ring-2 ring-white/50",
						)}
					>
						<Calendar className="h-3.5 w-3.5" />
						<span>{formatDateDisplay() || t("selectDateRange")}</span>
						{dateRange[0].startDate && (
							<X
								className="h-3 w-3 text-white/70 hover:text-white hover:rotate-90 transition-transform"
								onClick={(e) => {
									e.stopPropagation();
									clearDates();
								}}
							/>
						)}
					</button>

					{isCalendarOpen && (
						<div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
							{/* Header */}
							<div className="px-4 py-2.5 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-between">
								<div className="flex gap-1">
									{[
										{ days: 7, label: t("lastWeek") },
										{ days: 30, label: t("lastMonth") },
										{ days: 90, label: t("last3Months") },
									].map(({ days, label }) => (
										<button
											key={days}
											type="button"
											className="h-6 px-2.5 text-[9px] font-semibold text-white/90 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
											onClick={() => setPresetRange(days)}
										>
											{label}
										</button>
									))}
								</div>
								<button
									type="button"
									className="text-white/70 hover:text-white text-[9px] font-medium px-2 py-1 rounded transition-colors"
									onClick={clearDates}
								>
									{t("clear")}
								</button>
							</div>

							<DateRange
								onChange={handleDateChange}
								moveRangeOnFirstSelection={false}
								ranges={dateRange}
								months={2}
								direction="horizontal"
								locale={tr}
								maxDate={new Date()}
								rangeColors={["#8b5cf6"]}
								color="#8b5cf6"
								showDateDisplay={false}
								className="font-sans!"
							/>

							<div className="px-4 py-2 bg-slate-50 flex justify-end border-t">
								<button
									type="button"
									className="h-7 px-4 bg-linear-to-r from-indigo-500 to-violet-500 text-white font-semibold text-[10px] rounded-lg shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
									onClick={() => setIsCalendarOpen(false)}
								>
									✓ {t("apply")}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Filter Button */}
			<button
				type="submit"
				className="group relative h-8 flex items-center justify-center gap-1.5 rounded-xl px-4 text-[10px] font-bold text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
			>
				<div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500" />
				<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
				<Filter className="relative h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
				<span className="relative">{t("filter")}</span>
			</button>
		</form>
	);
};

export default FilterForm;

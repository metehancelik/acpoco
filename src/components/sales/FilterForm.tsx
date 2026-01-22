"use client";

import axios from "axios";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";

//KİŞİNİN BİRDEN FAZLA MAĞAZASI OLABİLİR (MAĞAZA SEÇİMİ)
//MÜŞTERİ İSMİ İLE ARAMA YAPILABİLİR
//TARİH ARALIĞI İLE ARAMA YAPILABİLİR
//SİPARİŞİN DURUMU İLE ARAMA YAPILABİLİR (ÖDEME BEKLİYOR, ÜRETİM BEKLİYOR, ÜRETİLDİ,KARGOYA VERİLDİ)
//RESET FİLTER BUTONU OLABİLİR
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
	orderDateStart: Date | null;
	orderDateEnd: Date | null;
	status: string;
	orderId: string;
	warehouse: string;
	country: string;
};

const FilterForm = () => {
	const t = useTranslations("Orders");
	const session = useSession();
	const [stores, setStores] = React.useState([]);
	const {
		register,
		handleSubmit,
		control,
		// formState: { errors },
	} = useForm({
		defaultValues: {
			storeId: "",
			status: "",
			country: "",
			warehouse: "",
			orderId: "",
			orderDateStart: null as Date | null,
			orderDateEnd: null as Date | null,
		},
	});
	const searchParams = new URLSearchParams();
	setDefaultLocale("tr");
	registerLocale("tr", tr);

	const onSubmit = (data: Inputs) => {
		const formattedStartDate = data.orderDateStart
			? format(data.orderDateStart, "yyyy-MM-dd")
			: null;
		data.orderDateStart = formattedStartDate as unknown as Date | null;
		const formattedEndDate = data.orderDateEnd
			? format(data.orderDateEnd, "yyyy-MM-dd")
			: null;
		data.orderDateEnd = formattedEndDate as unknown as Date | null;

		if (data.storeId) searchParams.append("storeId", data.storeId);
		// if (data.customerUsername)
		//   searchParams.append("customerUsername", data.customerUsername);
		if (data.orderDateStart)
			searchParams.append("orderDateStart", formattedStartDate!);
		if (data.orderDateEnd)
			searchParams.append("orderDateEnd", formattedEndDate!);
		if (data.status) searchParams.append("status", data.status);
		if (data.orderId) searchParams.append("orderId", data.orderId);
		if (data.warehouse) searchParams.append("warehouse", data.warehouse);
		if (data.country) searchParams.append("country", data.country);

		const queryString = searchParams.toString();
		window.history.replaceState(null, "", `?${queryString}`); // Update the URL with the query string
	};

	useEffect(() => {
		const getStores = async () => {
			try {
				const res = await axios.get(`/api/stores/mystores`);
				setStores(res.data.stores);
			} catch (error: unknown) {
				console.error(error);
			}
		};
		getStores();
	}, []);

	return (
		<div className="col-span-12 w-full">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="grid grid-cols-8 gap-2 items-center w-full"
			>
				<Controller
					control={control}
					name="status"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="orderStatus"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("orderStatus")}
							</label>

							<select
								{...field}
								id="status"
								value={field.value}
								defaultValue=""
								className="w-full text-sm rounded-md border border-primary py-2 pl-3 pr-10 text-gray-900"
							>
								<option className="text-sm" value="">
									{t("all")}
								</option>
								{/* Normal users see: eşleşme bekliyor, ödeme bekliyor */}
								{session.data?.user?.role !== "ADMIN" && (
									<>
										<option className="text-sm" value="waitingMatch">
											{t("waitingMatch")}
										</option>
										<option className="text-sm" value="waitingPayment">
											{t("waitingPayment")}
										</option>
									</>
								)}
								{/* Admin users see: hazırlanıyor, kargoya verildi */}
								{session.data?.user?.role === "ADMIN" && (
									<>
										<option className="text-sm" value="waitingProduction">
											{t("processing")}
										</option>
										<option className="text-sm" value="shipped">
											{t("shipped")}
										</option>
									</>
								)}
							</select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="storeId"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="store"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("store")}
							</label>

							<select
								{...field}
								id="storeId"
								value={field.value}
								defaultValue="My Store"
								className=" w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
							>
								<option className="text-sm" value="">
									{t("all")}
								</option>
								{stores.map((store: { storeId: string; storeName: string }) => (
									<option key={store.storeId} value={store.storeId}>
										{store.storeName}
									</option>
								))}
							</select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="country"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="country"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("country")}
							</label>

							<select
								{...field}
								id="country"
								value={field.value}
								defaultValue=""
								className=" w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
							>
								<option className="text-sm" value="">
									{t("all")}
								</option>
								{COUNTRIES.map((country: { code: string; name: string }) => (
									<option key={country.code} value={country.code}>
										{country.name}
									</option>
								))}
							</select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="warehouse"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="warehouse"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("warehouse")}
							</label>

							<select
								{...field}
								id="warehouse"
								value={field.value}
								defaultValue=""
								className=" w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
							>
								<option className="text-sm" value="">
									{t("all")}
								</option>
								{WAREHOUSES.map((warehouse: { code: string; name: string }) => (
									<option key={warehouse.code} value={warehouse.code}>
										{warehouse.name}
									</option>
								))}
							</select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="orderId"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="orderId"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("orderNo")}
							</label>

							<input
								{...field}
								placeholder={t("enterOrderNo")}
								className="w-full rounded-md border border-primary py-2 px-2 text-sm text-gray-900 h-9"
							/>
						</div>
					)}
				/>

				{/* <Controller
          control={control}
          name="customerUsername"
          render={({ field }) => (
            <div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
              <label
                htmlFor="customerUsername"
                className=" text-sm font-medium leading-6 text-gray-900"
              >
                Müşteri İsmi
              </label>

              <input
                {...field}
                placeholder="Müşteri adı giriniz"
                className="w-full rounded-md border border-primary py-2 px-2 text-sm text-gray-900 h-9"
              />
            </div>
          )}
        /> */}
				<Controller
					control={control}
					{...register("orderDateStart")}
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="startDate"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("startDate")}
							</label>
							<DatePicker
								className="rounded-md text-sm text-text-primary pl-2 w-full pr-0 py-1.5"
								id="orderDateStart"
								selected={field.value}
								onChange={(date) => field.onChange(date)}
								maxDate={new Date()}
								placeholderText={t("startDatePlaceholder")}
								monthsShown={1}
								locale={tr}
								dateFormat="dd/MM/yyyy"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="orderDateEnd"
					render={({ field }) => (
						<div className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1">
							<label
								htmlFor="endDate"
								className=" text-sm font-medium leading-6 text-gray-900"
							>
								{t("endDate")}
							</label>

							<DatePicker
								className="rounded-md text-sm border-primary text-text-primary pl-2 w-full pr-0 py-1.5"
								id="orderDateEnd"
								selected={field.value}
								onChange={(date) => field.onChange(date)}
								maxDate={new Date()}
								placeholderText={t("endDatePlaceholder")}
								monthsShown={1}
								locale={tr}
								dateFormat="dd/MM/yyyy"
							/>
						</div>
					)}
				/>

				<button
					type="submit"
					className="col-span-6 sm:col-span-2 lg:col-span-2 xl:col-span-1 mt-6 items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/90  focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
				>
					{t("filter")}
				</button>
			</form>
		</div>
	);
};

export default FilterForm;

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import AlertNotification from "@/utils/alertNotification";

type Inputs = {
	title: string;
	salutation: string;
	street: string;
	houseNumber: string;
	addressLine2: string;
	city: string;
	country: string;
	firstName: string;
	lastName: string;
	gsmNumber: string;
	vatNumber: string;
	zipCode: string;
	companyName: string;
};

type IBillingAddress = {
	_id: string;
	title: string;
	salutation?: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	firstName: string;
	lastName: string;
	gsmNumber: string;
	vatNumber: string;
	zipCode: string;
	companyName: string;
};

const BillingAddress = () => {
	const queryClient = useQueryClient();
	const [billingAddress, setBillingAddress] =
		React.useState<IBillingAddress | null>(null);
	const {
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: billingAddress?.title ? billingAddress.title : "",
			salutation: "",
			street: "",
			houseNumber: "",
			addressLine2: billingAddress?.addressLine2 || "",
			city: billingAddress?.city || "",
			country: billingAddress?.country || "Almanya",
			firstName: billingAddress?.firstName || "",
			lastName: billingAddress?.lastName || "",
			gsmNumber: billingAddress?.gsmNumber || "",
			vatNumber: billingAddress?.vatNumber || "",
			zipCode: billingAddress?.zipCode || "",
			companyName: billingAddress?.companyName || "",
		},
	});

	const isCompany = Boolean((watch("companyName") || "").trim().length);

	const {
		isLoading: isFetching,
		data,
		error,
	} = useQuery({
		queryKey: ["billing-address"],
		queryFn: async () => {
			const res = await axios.get("/api/users/billing-address");
			return res.data as IBillingAddress;
		},
	});

	useEffect(() => {
		if (!data) return;
		setBillingAddress(data);
		let street = "";
		let houseNumber = "";
		if (data?.addressLine1) {
			const match = data.addressLine1.match(/^(.*?)[,\s]+(\d+\w*)$/);
			if (match) {
				street = match[1]?.trim();
				houseNumber = match[2]?.trim();
			} else {
				street = data.addressLine1.trim();
			}
		}
		reset({
			title: data?.title || "",
			salutation: data?.salutation || "",
			street,
			houseNumber,
			addressLine2: data?.addressLine2 || "",
			city: data?.city || "",
			country: data?.country || "Almanya",
			firstName: data?.firstName || "",
			lastName: data?.lastName || "",
			gsmNumber: data?.gsmNumber || "",
			vatNumber: data?.vatNumber || "",
			zipCode: data?.zipCode || "",
			companyName: data?.companyName || "",
		});
	}, [data, reset]);

	useEffect(() => {
		if (!error) return;
		AlertNotification(String(error), "error");
	}, [error]);

	const { mutate: updateBillingAddress, isPending: isUpdating } = useMutation({
		mutationFn: async (formData: Inputs) => {
			const payload = {
				title: formData.title,
				salutation: formData.salutation,
				addressLine1:
					`${(formData.street || "").trim()} ${(formData.houseNumber || "").trim()}`.trim(),
				addressLine2: formData.addressLine2,
				city: formData.city,
				country: formData.country,
				firstName: formData.firstName,
				lastName: formData.lastName,
				gsmNumber: formData.gsmNumber,
				vatNumber: formData.vatNumber,
				zipCode: formData.zipCode,
				companyName: formData.companyName,
			};
			return axios.put(
				`/api/users/billing-address/${billingAddress?._id}`,
				payload,
			);
		},
		onSuccess: () => {
			AlertNotification("Fatura adresi güncellendi", "success");
			queryClient.invalidateQueries({ queryKey: ["billing-address"] });
		},
		onError: (error: unknown) => {
			AlertNotification(error as string, "error");
		},
	});

	const onSubmit = (data: Inputs) => {
		updateBillingAddress(data);
	};

	//

	return (
		<div className="w-full lg:w-1/2 rounded-md bg-gray-100 p-5 text-sm">
			<p className="font-bold text-primary mb-4 text-base"> Fatura Bilgileri</p>
			<form
				className="grid grid-cols-12 gap-3 "
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					control={control}
					name="salutation"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Hitap</label>
							<select
								{...field}
								id="salutation"
								name="salutation"
								className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
							>
								<option value="">Seçiniz</option>
								<option value="Mr">Bay</option>
								<option value="Ms">Bayan</option>
								<option value="Other">Diğer</option>
							</select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Başlık</label>
							<input
								{...field}
								type="text"
								id="title"
								name="title"
								placeholder="Fatura başlığı"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="firstName"
					rules={{
						validate: (v) =>
							isCompany ? true : Boolean((v || "").trim()) || "İsim gereklidir",
					}}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">İsim</label>
							<input
								{...field}
								placeholder="İsminizi giriniz"
								type="text"
								id="firstName"
								name="firstName"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.firstName && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.firstName.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="lastName"
					rules={{
						validate: (v) =>
							isCompany
								? true
								: Boolean((v || "").trim()) || "Soyisim gereklidir",
					}}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Soyisim</label>
							<input
								{...field}
								type="text"
								placeholder="Soyisminizi giriniz"
								id="lastName"
								name="lastName"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.lastName && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.lastName.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="street"
					rules={{ required: "Sokak gereklidir" }}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Sokak</label>
							<input
								{...field}
								type="text"
								placeholder="Sokak adı"
								id="street"
								name="street"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.street && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.street.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="houseNumber"
					rules={{ required: "No gereklidir" }}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">No</label>
							<input
								{...field}
								type="text"
								id="houseNumber"
								placeholder="Ev/Bina No"
								name="houseNumber"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.houseNumber && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.houseNumber.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="addressLine2"
					render={({ field }) => (
						<div className="col-span-12">
							<label htmlFor="">Adres Ek</label>
							<input
								{...field}
								type="text"
								id="addressLine2"
								placeholder="Daire, kat, blok vb. (opsiyonel)"
								name="addressLine2"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="city"
					rules={{ required: "Şehir gereklidir" }}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Şehir (Ort)</label>
							<input
								{...field}
								type="text"
								id="city"
								placeholder="Şehir giriniz"
								name="city"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.city && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.city.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="country"
					rules={{ required: "Ülke gereklidir" }}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Ülke</label>
							<input
								{...field}
								type="text"
								id="country"
								placeholder="Ülke giriniz (örn. Almanya)"
								name="country"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.country && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.country.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="zipCode"
					rules={{
						required: "Posta kodu gereklidir",
						pattern: { value: /^[0-9]{5}$/, message: "PLZ 5 haneli olmalıdır" },
					}}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Posta Kodu (PLZ)</label>
							<input
								{...field}
								type="text"
								id="zipCode"
								placeholder="Posta kodu giriniz"
								name="zipCode"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.zipCode && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.zipCode.message)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="gsmNumber"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Telefon</label>
							<input
								{...field}
								type="text"
								id="gsmNumber"
								placeholder="GSM Numarası"
								name="gsmNumber"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="companyName"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Şirket Adı</label>
							<input
								{...field}
								type="text"
								id="companyName"
								placeholder="Şirket adı (varsa)"
								name="companyName"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="vatNumber"
					rules={{
						validate: (v) => {
							if (!isCompany) return true;
							const ok = /^DE[0-9]{9}$/.test((v || "").toUpperCase());
							return ok || "USt-IdNr. 'DE' + 9 rakam olmalıdır";
						},
					}}
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">USt-IdNr. (DEXXXXXXXXX)</label>
							<input
								{...field}
								type="text"
								id="vatNumber"
								placeholder="DE ile başlayan KDV Numarası"
								name="vatNumber"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
							{errors.vatNumber && (
								<p className="text-red-600 text-xs mt-1">
									{String(errors.vatNumber.message)}
								</p>
							)}
						</div>
					)}
				/>
				<div className="col-span-6 flex items-end">
					<button
						disabled={isFetching || isUpdating}
						className="text-primary font-bold w-full px-4 py-2 text-sm flex items-center justify-center space-x-3 border border-primary rounded-md bg-white hover:bg-primary hover:text-white"
					>
						<p>{isUpdating ? "Bekleyiniz..." : "Kaydet"}</p>
					</button>
				</div>
			</form>
		</div>
	);
};

export default BillingAddress;

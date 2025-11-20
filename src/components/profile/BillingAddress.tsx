import axios from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import AlertNotification from "@/utils/alertNotification";

type Inputs = {
	title: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	firstName: string;
	lastName: string;
	identityNumber: string;
	gsmNumber: string;
	taxOffice: string;
	vatNumber: string;
	zipCode: string;
	companyName: string;
};

type IBillingAddress = {
	_id: string;
	title: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	firstName: string;
	lastName: string;
	identityNumber: string;
	gsmNumber: string;
	taxOffice: string;
	vatNumber: string;
	zipCode: string;
	companyName: string;
};

const BillingAddress = () => {
	const [loading, setLoading] = React.useState(false);
	const [billingAddress, setBillingAddress] =
		React.useState<IBillingAddress | null>(null);
	const {
		handleSubmit,
		control,
		reset,
		// formState: { errors },
	} = useForm({
		defaultValues: {
			title: billingAddress?.title ? billingAddress.title : "",
			addressLine1: billingAddress?.addressLine1 || "",
			addressLine2: billingAddress?.addressLine2 || "",
			city: billingAddress?.city || "",
			country: billingAddress?.country || "",
			firstName: billingAddress?.firstName || "",
			lastName: billingAddress?.lastName || "",
			identityNumber: billingAddress?.identityNumber || "",
			gsmNumber: billingAddress?.gsmNumber || "",
			taxOffice: billingAddress?.taxOffice || "",
			vatNumber: billingAddress?.vatNumber || "",
			zipCode: billingAddress?.zipCode || "",
			companyName: billingAddress?.companyName || "",
		},
	});

	const onSubmit = async (data: Inputs) => {
		setLoading(true);
		try {
			await axios.put(
				`/api/users/billing-address/${billingAddress?._id}`,
				data,
			);
			AlertNotification("Fatura adresi güncellendi", "success");
		} catch (error: unknown) {
			AlertNotification(error as string, "error");
		} finally {
			setLoading(false);
		}
	};

	const getBillingAddress = async () => {
		try {
			const res = await axios.get("/api/users/billing-address");

			setBillingAddress(res.data);
		} catch (error: unknown) {
			AlertNotification(error as string, "error");
		}
	};

	useEffect(() => {
		getBillingAddress();
	}, [getBillingAddress]);

	useEffect(() => {
		if (billingAddress) {
			reset({
				title: billingAddress?.title || "",
				addressLine1: billingAddress?.addressLine1 || "",
				addressLine2: billingAddress?.addressLine2 || "",
				city: billingAddress?.city || "",
				country: billingAddress?.country || "",
				firstName: billingAddress?.firstName || "",
				lastName: billingAddress?.lastName || "",
				identityNumber: billingAddress?.identityNumber || "",
				gsmNumber: billingAddress?.gsmNumber || "",
				taxOffice: billingAddress?.taxOffice || "",
				vatNumber: billingAddress?.vatNumber || "",
				zipCode: billingAddress?.zipCode || "",
				companyName: billingAddress?.companyName || "",
			});
		}
	}, [billingAddress, reset]);

	return (
		<div className="w-full lg:w-1/2 rounded-md bg-gray-100 p-5 text-sm">
			<p className="font-bold text-primary mb-4 text-base"> Fatura Bilgileri</p>
			<form
				className="grid grid-cols-12 gap-3 "
				onSubmit={handleSubmit(onSubmit)}
			>
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
						</div>
					)}
				/>
				<Controller
					control={control}
					name="lastName"
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
						</div>
					)}
				/>
				<Controller
					control={control}
					name="addressLine1"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Adres 1</label>
							<input
								{...field}
								type="text"
								placeholder="Adresinizi giriniz"
								id="addressLine1"
								name="addressLine1"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="addressLine2"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Adres 2</label>
							<input
								{...field}
								type="text"
								id="addressLine2"
								placeholder="Adresinizi giriniz (Zorunlu değil)"
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
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Şehir</label>
							<input
								{...field}
								type="text"
								id="city"
								placeholder="Şehir giriniz"
								name="city"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="country"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Ülke</label>
							<input
								{...field}
								type="text"
								id="country"
								placeholder="Ülke giriniz"
								name="country"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="zipCode"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Posta Kodu</label>
							<input
								{...field}
								type="text"
								id="zipCode"
								placeholder="Posta kodu giriniz"
								name="zipCode"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="identityNumber"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Kimlik No</label>
							<input
								{...field}
								type="text"
								id="identityNumber"
								placeholder="TC Kimlik No"
								name="identityNumber"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
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
							<label htmlFor="">Şirket İsmi</label>
							<input
								{...field}
								type="text"
								id="companyName"
								placeholder="Şirket İsmi"
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
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Vergi No</label>
							<input
								{...field}
								type="text"
								id="vatNumber"
								placeholder="Vergi No"
								name="vatNumber"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="taxOffice"
					render={({ field }) => (
						<div className="col-span-6">
							<label htmlFor="">Vergi Dairesi</label>
							<input
								{...field}
								type="text"
								id="taxOffice"
								placeholder="Vergi No"
								name="taxOffice"
								value={field.value}
								className="w-full p-2 border border-gray-300 rounded-md text-sm"
							/>
						</div>
					)}
				/>
				<div className="col-span-6 flex items-end">
					<button
						disabled={loading}
						className="text-primary font-bold w-full px-4 py-2 text-sm flex items-center justify-center space-x-3 border border-primary rounded-md bg-white hover:bg-primary hover:text-white"
					>
						<p>{loading ? "Bekleyiniz..." : "Kaydet"}</p>
					</button>
				</div>
			</form>
		</div>
	);
};

export default BillingAddress;

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
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

const emptyDefaults = {
	title: "",
	salutation: "",
	street: "",
	houseNumber: "",
	addressLine2: "",
	city: "",
	country: "Almanya",
	firstName: "",
	lastName: "",
	gsmNumber: "",
	vatNumber: "",
	zipCode: "",
	companyName: "",
} satisfies Inputs;

function parseAddressLine1(addressLine1: string | undefined) {
	if (!addressLine1?.trim()) return { street: "", houseNumber: "" };
	const match = addressLine1.match(/^(.*?)[,\s]+(\d+\w*)$/);
	if (match) {
		return {
			street: (match[1] ?? "").trim(),
			houseNumber: (match[2] ?? "").trim(),
		};
	}
	return { street: addressLine1.trim(), houseNumber: "" };
}

const BillingAddress = () => {
	const queryClient = useQueryClient();
	const t = useTranslations("Billing");
	const tCommon = useTranslations("Common");
	const {
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: emptyDefaults,
	});

	const isCompany = Boolean((watch("companyName") || "").trim().length);

	const { data, error, isFetching } = useQuery({
		queryKey: ["billing-address"],
		queryFn: async () => {
			const res = await axios.get<IBillingAddress | null>(
				"/api/users/billing-address",
			);
			return res.data ?? null;
		},
		staleTime: 2 * 60 * 1000,
	});

	useEffect(() => {
		if (data === undefined) return;
		const { street, houseNumber } = parseAddressLine1(data?.addressLine1);
		reset({
			title: data?.title ?? "",
			salutation: data?.salutation ?? "",
			street,
			houseNumber,
			addressLine2: data?.addressLine2 ?? "",
			city: data?.city ?? "",
			country: data?.country ?? "Almanya",
			firstName: data?.firstName ?? "",
			lastName: data?.lastName ?? "",
			gsmNumber: data?.gsmNumber ?? "",
			vatNumber: data?.vatNumber ?? "",
			zipCode: data?.zipCode ?? "",
			companyName: data?.companyName ?? "",
		});
	}, [data, reset]);

	useEffect(() => {
		if (!error) return;
		AlertNotification(String(error), "error");
	}, [error]);

	const { mutate: updateBillingAddress, isPending: isUpdating } = useMutation({
		mutationFn: async ({
			formData,
			addressId,
		}: {
			formData: Inputs;
			addressId: string | undefined;
		}) => {
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
				`/api/users/billing-address/${addressId ?? "undefined"}`,
				payload,
			);
		},
		onSuccess: () => {
			AlertNotification(t("billingAddressUpdated"), "success");
			queryClient.invalidateQueries({ queryKey: ["billing-address"] });
		},
		onError: (error: unknown) => {
			AlertNotification(error as string, "error");
		},
	});

	const onSubmit = (formData: Inputs) => {
		updateBillingAddress({ formData, addressId: data?._id });
	};

	//

	return (
		<form
			className="grid grid-cols-12 gap-3 text-sm"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="salutation"
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("salutation")}</label>
						<select
							{...field}
							id="salutation"
							name="salutation"
							className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
						>
							<option value="">{t("select")}</option>
							<option value="Mr">{t("mr")}</option>
							<option value="Ms">{t("ms")}</option>
							<option value="Other">{t("other")}</option>
						</select>
					</div>
				)}
			/>
			<Controller
				control={control}
				name="title"
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("title")}</label>
						<input
							{...field}
							type="text"
							id="title"
							name="title"
							placeholder={t("invoiceTitle")}
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
						isCompany
							? true
							: Boolean((v || "").trim()) || t("firstNameRequired"),
				}}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("firstName")}</label>
						<input
							{...field}
							placeholder={t("enterFirstName")}
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
							: Boolean((v || "").trim()) || t("lastNameRequired"),
				}}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("lastName")}</label>
						<input
							{...field}
							type="text"
							placeholder={t("enterLastName")}
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
				rules={{ required: t("streetRequired") }}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("street")}</label>
						<input
							{...field}
							type="text"
							placeholder={t("streetName")}
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
				rules={{ required: t("houseNumberRequired") }}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("houseNumber")}</label>
						<input
							{...field}
							type="text"
							id="houseNumber"
							placeholder={t("houseBuildingNo")}
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
						<label htmlFor="">{t("addressLine2")}</label>
						<input
							{...field}
							type="text"
							id="addressLine2"
							placeholder={t("addressLine2Placeholder")}
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
				rules={{ required: t("cityRequired") }}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("city")}</label>
						<input
							{...field}
							type="text"
							id="city"
							placeholder={t("enterCity")}
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
				rules={{ required: t("countryRequired") }}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("country")}</label>
						<input
							{...field}
							type="text"
							id="country"
							placeholder={t("enterCountry")}
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
					required: t("zipCodeRequired"),
					pattern: { value: /^[0-9]{5}$/, message: t("zipCode5Digits") },
				}}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("zipCode")}</label>
						<input
							{...field}
							type="text"
							id="zipCode"
							placeholder={t("enterZipCode")}
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
						<label htmlFor="">{t("phone")}</label>
						<input
							{...field}
							type="text"
							id="gsmNumber"
							placeholder={t("gsmNumber")}
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
						<label htmlFor="">{t("companyName")}</label>
						<input
							{...field}
							type="text"
							id="companyName"
							placeholder={t("companyNamePlaceholder")}
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
						return ok || t("vatNumberInvalid");
					},
				}}
				render={({ field }) => (
					<div className="col-span-6">
						<label htmlFor="">{t("vatNumber")}</label>
						<input
							{...field}
							type="text"
							id="vatNumber"
							placeholder={t("vatNumberPlaceholder")}
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
					<p>{isUpdating ? tCommon("pleaseWait") : tCommon("save")}</p>
				</button>
			</div>
		</form>
	);
};

export default BillingAddress;

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

	const inputClass =
		"w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground leading-relaxed transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
	const labelClass = "block text-sm font-medium text-foreground mb-0.5";
	const errorClass = "text-destructive text-xs mt-0.5";

	return (
		<form
			className="flex h-full min-h-0 flex-col text-sm leading-relaxed"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid flex-1 grid-cols-12 gap-3 content-start">
				<Controller
					control={control}
					name="salutation"
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="salutation" className={labelClass}>
								{t("salutation")}
							</label>
							<select
								{...field}
								id="salutation"
								name="salutation"
								className={inputClass}
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
						<div className="col-span-6 space-y-1">
							<label htmlFor="title" className={labelClass}>
								{t("title")}
							</label>
							<input
								{...field}
								type="text"
								id="title"
								name="title"
								placeholder={t("invoiceTitle")}
								value={field.value}
								className={inputClass}
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
						<div className="col-span-6 space-y-1">
							<label htmlFor="firstName" className={labelClass}>
								{t("firstName")}
							</label>
							<input
								{...field}
								placeholder={t("enterFirstName")}
								type="text"
								id="firstName"
								name="firstName"
								value={field.value}
								className={inputClass}
							/>
							{errors.firstName && (
								<p className={errorClass}>{String(errors.firstName.message)}</p>
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
						<div className="col-span-6 space-y-1">
							<label htmlFor="lastName" className={labelClass}>
								{t("lastName")}
							</label>
							<input
								{...field}
								type="text"
								placeholder={t("enterLastName")}
								id="lastName"
								name="lastName"
								value={field.value}
								className={inputClass}
							/>
							{errors.lastName && (
								<p className={errorClass}>{String(errors.lastName.message)}</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="street"
					rules={{ required: t("streetRequired") }}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="street" className={labelClass}>
								{t("street")}
							</label>
							<input
								{...field}
								type="text"
								placeholder={t("streetName")}
								id="street"
								name="street"
								value={field.value}
								className={inputClass}
							/>
							{errors.street && (
								<p className={errorClass}>{String(errors.street.message)}</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="houseNumber"
					rules={{ required: t("houseNumberRequired") }}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="houseNumber" className={labelClass}>
								{t("houseNumber")}
							</label>
							<input
								{...field}
								type="text"
								id="houseNumber"
								placeholder={t("houseBuildingNo")}
								name="houseNumber"
								value={field.value}
								className={inputClass}
							/>
							{errors.houseNumber && (
								<p className={errorClass}>
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
						<div className="col-span-12 space-y-1">
							<label htmlFor="addressLine2" className={labelClass}>
								{t("addressLine2")}
							</label>
							<input
								{...field}
								type="text"
								id="addressLine2"
								placeholder={t("addressLine2Placeholder")}
								name="addressLine2"
								value={field.value}
								className={inputClass}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="city"
					rules={{ required: t("cityRequired") }}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="city" className={labelClass}>
								{t("city")}
							</label>
							<input
								{...field}
								type="text"
								id="city"
								placeholder={t("enterCity")}
								name="city"
								value={field.value}
								className={inputClass}
							/>
							{errors.city && (
								<p className={errorClass}>{String(errors.city.message)}</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="country"
					rules={{ required: t("countryRequired") }}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="country" className={labelClass}>
								{t("country")}
							</label>
							<input
								{...field}
								type="text"
								id="country"
								placeholder={t("enterCountry")}
								name="country"
								value={field.value}
								className={inputClass}
							/>
							{errors.country && (
								<p className={errorClass}>{String(errors.country.message)}</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="zipCode"
					rules={{
						required: t("zipCodeRequired"),
						pattern: {
							value: /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/,
							message: t("zipCodeInvalid"),
						},
					}}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="zipCode" className={labelClass}>
								{t("zipCode")}
							</label>
							<input
								{...field}
								type="text"
								id="zipCode"
								placeholder={t("enterZipCode")}
								name="zipCode"
								value={field.value}
								className={inputClass}
							/>
							{errors.zipCode && (
								<p className={errorClass}>{String(errors.zipCode.message)}</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="gsmNumber"
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="gsmNumber" className={labelClass}>
								{t("phone")}
							</label>
							<input
								{...field}
								type="text"
								id="gsmNumber"
								placeholder={t("gsmNumber")}
								name="gsmNumber"
								value={field.value}
								className={inputClass}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="companyName"
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="companyName" className={labelClass}>
								{t("companyName")}
							</label>
							<input
								{...field}
								type="text"
								id="companyName"
								placeholder={t("companyNamePlaceholder")}
								name="companyName"
								value={field.value}
								className={inputClass}
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
							if (!(v || "").trim()) return true;
							const ok = /^[A-Za-z]{2}[A-Za-z0-9+*]{2,12}$/.test(
								(v || "").trim(),
							);
							return ok || t("vatNumberInvalid");
						},
					}}
					render={({ field }) => (
						<div className="col-span-6 space-y-1">
							<label htmlFor="vatNumber" className={labelClass}>
								{t("vatNumber")}
							</label>
							<input
								{...field}
								type="text"
								id="vatNumber"
								placeholder={t("vatNumberPlaceholder")}
								name="vatNumber"
								value={field.value}
								className={inputClass}
							/>
							{errors.vatNumber && (
								<p className={errorClass}>{String(errors.vatNumber.message)}</p>
							)}
						</div>
					)}
				/>
			</div>
			<div className="mt-auto pt-3">
				<button
					type="submit"
					disabled={isFetching || isUpdating}
					className="cursor-pointer w-full rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
				>
					{isUpdating ? tCommon("pleaseWait") : tCommon("save")}
				</button>
			</div>
		</form>
	);
};

export default BillingAddress;

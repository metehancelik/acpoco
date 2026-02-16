"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { LayoutGrid, Lock, MapPin, Store, User, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect, useState } from "react";

import BillingAddress from "@/components/profile/BillingAddress";
import PasswordChange from "@/components/profile/PasswordChange";
import WalletLogs from "@/components/profile/WalletLogs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AlertNotification from "@/utils/alertNotification";

interface IStoreTable {
	storeId: number;
	storeName: string;
	userId: { balance: number };
	marketplaceId: number;
	marketplaceName: string;
	accountName: string | null;
	email: string | null;
	integrationUrl: string | null;
	active: boolean;
	companyName: string;
	phone: string;
	publicEmail: string;
	website: string;
	refreshDate: Date | null;
	lastRefreshAttempt: Date | null;
	createDate: Date;
	modifyDate: Date;
	autoRefresh: boolean;
	statusMappings: unknown;
}

const Profile = () => {
	const session = useSession();
	const t = useTranslations("Profile");
	const tCommon = useTranslations("Common");
	const tBilling = useTranslations("Billing");
	const tWallet = useTranslations("Wallet");
	const [stores, setStores] = useState<IStoreTable[] | null>(null);
	const [name, setName] = useState<string>("");
	const [surname, setSurname] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "name") {
			setName(value);
		} else if (name === "surname") {
			setSurname(value);
		}
	};

	const submitHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.put("/api/users/", { name, surname });
			AlertNotification(t("profileUpdated"), "success");
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	useEffect(() => {
		const getMyStores = async () => {
			try {
				const res = await fetch("/api/stores/mystores");
				const data = await res.json();
				setStores(data.stores);
			} catch (error) {
				console.error("Error fetching stores:", error);
			}
		};
		setName(session.data?.user?.name || "");
		setSurname(session.data?.user?.surname || "");
		getMyStores();
	}, [session]);

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
			<div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<User className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
								{t("profileInfo")}
							</h1>
							<p className="mt-0.5 text-sm text-muted-foreground">
								{session.data?.user?.email}
							</p>
						</div>
					</div>
				</div>

				{/* Main grid: Profile + Password + Stores | Billing */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Left column */}
					<div className="flex flex-col gap-6">
						{/* Profile info card */}
						<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-primary/10 p-2.5">
										<LayoutGrid className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{t("profileInfo")}
										</CardTitle>
										<CardDescription className="text-sm">
											{session.data?.user?.email}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<form
									onSubmit={submitHandler}
									className="grid gap-4 sm:grid-cols-2"
								>
									<div className="space-y-2">
										<label
											htmlFor="name"
											className="text-sm font-medium text-foreground"
										>
											{t("firstName")}
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={name}
											onChange={handleChange}
											className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="surname"
											className="text-sm font-medium text-foreground"
										>
											{t("lastName")}
										</label>
										<input
											type="text"
											id="surname"
											name="surname"
											value={surname}
											onChange={handleChange}
											className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>
									<div className="sm:col-span-2">
										<button
											type="submit"
											className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
										>
											<PencilSquareIcon className="size-5" />
											{tCommon("edit")}
										</button>
									</div>
								</form>
							</CardContent>
						</Card>

						{/* My stores card */}
						<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-sage-blue/10 p-2.5">
										<Store className="h-5 w-5 text-sage-blue" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{t("myStores")}
										</CardTitle>
										<CardDescription className="text-sm">
											{t("myStores")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{stores && stores.length > 0 ? (
										stores.map((store, index) => (
											<div
												key={store.storeId ?? index}
												className="flex items-center rounded-lg border border-border bg-slate-50/50 px-4 py-3 text-sm text-foreground"
											>
												{store.storeName}
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">
											{t("noStoresYet")}
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Password change card */}
						<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-sage-orange/10 p-2.5">
										<Lock className="h-5 w-5 text-sage-orange" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{t("changePassword")}
										</CardTitle>
										<CardDescription className="text-sm">
											{t("newPassword")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<PasswordChange />
							</CardContent>
						</Card>
					</div>

					{/* Right column: Billing address */}
					<div className="lg:min-h-0">
						<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-gold/10 p-2.5">
										<MapPin className="h-5 w-5 text-gold" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{tBilling("billingInfo")}
										</CardTitle>
										<CardDescription className="text-sm">
											{tBilling("billingInfo")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<BillingAddress />
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Wallet transactions - full width */}
				<Card className="overflow-hidden border-0 bg-white shadow-md">
					<CardHeader className="border-b bg-linear-to-r from-slate-50 to-white">
						<div className="flex items-center gap-3">
							<div className="rounded-xl bg-gold/10 p-2.5">
								<Wallet className="h-5 w-5 text-gold" />
							</div>
							<div>
								<CardTitle className="text-lg font-semibold text-gray-900">
									{tWallet("walletTransactions")}
								</CardTitle>
								<CardDescription className="text-sm">
									{tWallet("walletTransactions")}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<WalletLogs />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Profile;

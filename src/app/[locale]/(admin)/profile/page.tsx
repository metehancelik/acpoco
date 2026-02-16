"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { LayoutGrid, MapPin, Store, User, Wallet } from "lucide-react";
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
		<div className="min-h-full bg-background">
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				{/* Page header — compact */}
				<header className="mb-5">
					<div className="flex flex-wrap items-center gap-3 sm:gap-4">
						<div
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/10"
							aria-hidden
						>
							<User className="h-5 w-5 text-primary" aria-hidden />
						</div>
						<div className="min-w-0 flex-1">
							<h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
								{t("profileInfo")}
							</h1>
							<p className="mt-0.5 text-sm text-muted-foreground">
								{session.data?.user?.email}
							</p>
						</div>
					</div>
				</header>

				{/* 2 columns: same min-height so they stay aligned with 0–2 stores */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 lg:items-stretch">
					{/* Left column — match Billing min-height so columns align */}
					<div className="flex flex-col gap-4 lg:min-h-128">
						<Card className="border border-border/80 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2">
							<CardHeader className="pb-2 pt-4 sm:pt-4">
								<div className="flex items-center gap-2.5">
									<div
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"
										aria-hidden
									>
										<LayoutGrid className="h-4 w-4 text-primary" aria-hidden />
									</div>
									<div className="min-w-0">
										<CardTitle className="text-sm font-semibold text-foreground sm:text-base">
											{t("profileInfo")}
										</CardTitle>
										<CardDescription className="text-xs text-muted-foreground">
											{session.data?.user?.email}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 pb-4">
								<form
									onSubmit={submitHandler}
									className="grid gap-3 sm:grid-cols-2"
								>
									<div className="space-y-1.5">
										<label
											htmlFor="name"
											className="text-xs font-medium text-foreground sm:text-sm"
										>
											{t("firstName")}
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={name}
											onChange={handleChange}
											className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>
									<div className="space-y-1.5">
										<label
											htmlFor="surname"
											className="text-xs font-medium text-foreground sm:text-sm"
										>
											{t("lastName")}
										</label>
										<input
											type="text"
											id="surname"
											name="surname"
											value={surname}
											onChange={handleChange}
											className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>
									<div className="sm:col-span-2">
										<button
											type="submit"
											className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
										>
											<PencilSquareIcon className="size-4" aria-hidden />
											{tCommon("edit")}
										</button>
									</div>
								</form>

								<div className="border-t border-border/80 pt-4">
									<h3 className="mb-3 text-xs font-semibold text-foreground sm:text-sm">
										{t("changePassword")}
									</h3>
									<PasswordChange />
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/80 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
							<CardHeader className="pb-2 pt-4 sm:pt-4">
								<div className="flex items-center gap-2.5">
									<div
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-blue/10"
										aria-hidden
									>
										<Store className="h-4 w-4 text-sage-blue" aria-hidden />
									</div>
									<div className="min-w-0">
										<CardTitle className="text-sm font-semibold text-foreground sm:text-base">
											{t("myStores")}
										</CardTitle>
										<CardDescription className="text-xs text-muted-foreground">
											{t("myStores")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="space-y-1.5">
									{stores && stores.length > 0 ? (
										<ul className="space-y-1.5" role="list">
											{stores.map((store, index) => (
												<li key={store.storeId ?? index}>
													<div className="flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground">
														{store.storeName}
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className="text-sm text-muted-foreground">
											{t("noStoresYet")}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right column: Billing — match left column height, save button at bottom */}
					<div className="flex min-h-0 flex-col gap-4">
						<Card className="flex h-full flex-col border border-border/80 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md lg:min-h-128">
							<CardHeader className="pb-1.5 pt-3 sm:pt-3">
								<div className="flex items-center gap-2.5">
									<div
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10"
										aria-hidden
									>
										<MapPin className="h-4 w-4 text-gold" aria-hidden />
									</div>
									<div className="min-w-0">
										<CardTitle className="text-sm font-semibold text-foreground sm:text-base">
											{tBilling("billingInfo")}
										</CardTitle>
										<CardDescription className="text-xs text-muted-foreground">
											{tBilling("billingInfo")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="flex min-h-0 flex-1 flex-col pb-3 pt-0">
								<BillingAddress />
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Wallet — compact */}
				<section className="mt-6" aria-labelledby="wallet-heading">
					<Card className="overflow-hidden border border-border/80 bg-card shadow-sm">
						<CardHeader
							id="wallet-heading"
							className="border-b border-border/80 bg-muted/20 py-3 sm:py-4"
						>
							<div className="flex items-center gap-2.5">
								<div
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10"
									aria-hidden
								>
									<Wallet className="h-4 w-4 text-gold" aria-hidden />
								</div>
								<div className="min-w-0">
									<CardTitle className="text-sm font-semibold text-foreground sm:text-base">
										{tWallet("walletTransactions")}
									</CardTitle>
									<CardDescription className="text-xs text-muted-foreground">
										{tWallet("walletTransactions")}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<WalletLogs />
						</CardContent>
					</Card>
				</section>
			</div>
		</div>
	);
};

export default Profile;

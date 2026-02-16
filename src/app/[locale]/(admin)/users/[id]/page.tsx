"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, Percent, User, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import ManualDiscountManagement from "@/components/dashboard/ManualDiscountManagement";
import WalletLogsTable from "@/components/dashboard/WalletLogsTable";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import UserBillingAddress from "@/components/users/UserBillingAddress";
import UserDetailCard from "@/components/users/UserDetailCard";
import AlertNotification from "@/utils/alertNotification";

export interface IUserStore {
	_id: string;
	storeName: string;
}
export interface IBillingAddress {
	title: string;
	firstName: string;
	lastName: string;
	companyName: string;
	identityNumber: string;
	vatNumber: string;
	taxOffice: string;
	gsmNumber: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	zipCode: string;
}
export interface IUserRoot {
	_id: string;
	name: string;
	surname: string;
	email: string;
	role: string;
	balance: number;
	stores: IUserStore[];
	billingAddress: IBillingAddress;
	productPriceRate: number;
	shippingPriceRate: number;
	warehousePriceRate: number;
}

interface IWalletLog {
	_id: string;
	changeAmount: number;
	currentBalance: number;
	finalBalance: string;
	createdAt: string;
	type: string;
	info: string;
	changedBy: { name: string; surname: string };
	userId: { name: string; surname: string };
}

interface IWalletLogsResponse {
	logs: IWalletLog[];
	totalPages: number;
}

const UserDetails = ({ params }: { params: { id: string } }) => {
	const t = useTranslations("UserDetail");
	const { data: user, error: userError } = useQuery<IUserRoot>({
		queryKey: ["user", params.id],
		queryFn: async () => {
			const res = await axios.get(`/api/users/${params.id}`);
			return res.data;
		},
	});

	const { data: walletData, error: walletError } =
		useQuery<IWalletLogsResponse>({
			queryKey: ["walletLogs", params.id],
			queryFn: async () => {
				const res = await axios.get(`/api/wallet/logs/${params.id}`);
				return res.data;
			},
		});

	if (userError) {
		AlertNotification(t("errorGeneric"), "error");
		console.error("Error getting user:", userError);
	}

	if (walletError) {
		AlertNotification(t("errorGeneric"), "error");
		console.error("Error getting wallet logs:", walletError);
	}

	const displayName = user
		? `${user.name} ${user.surname}`.trim() || user.email
		: "–";

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
			<div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<User className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
								{displayName}
							</h1>
							<p className="mt-0.5 text-sm text-muted-foreground">
								{user?.email ?? "–"}
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Main content */}
					<div className="min-w-0 flex-1 space-y-8">
						{/* User details + Billing row */}
						<div className="grid gap-6 md:grid-cols-2">
							<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-3">
										<div className="rounded-xl bg-primary/10 p-2.5">
											<User className="h-5 w-5 text-primary" />
										</div>
										<div>
											<CardTitle className="text-lg font-semibold text-gray-900">
												{t("userInfo")}
											</CardTitle>
											<CardDescription className="text-sm">
												{user?.email ?? "–"}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<UserDetailCard user={user ?? null} />
								</CardContent>
							</Card>

							<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-3">
										<div className="rounded-xl bg-gold/10 p-2.5">
											<MapPin className="h-5 w-5 text-gold" />
										</div>
										<div>
											<CardTitle className="text-lg font-semibold text-gray-900">
												{t("billingAddress")}
											</CardTitle>
											<CardDescription className="text-sm">
												{t("billingInfo")}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<UserBillingAddress billingAddress={user?.billingAddress} />
								</CardContent>
							</Card>
						</div>

						{/* Wallet transactions */}
						<Card className="overflow-hidden border-0 bg-white shadow-md">
							<CardHeader className="border-b bg-linear-to-r from-slate-50 to-white">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-gold/10 p-2.5">
										<Wallet className="h-5 w-5 text-gold" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{t("walletTransactions")}
										</CardTitle>
										<CardDescription className="text-sm">
											{t("walletTransactionsDescription")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-0">
								<WalletLogsTable
									walletLogs={walletData?.logs ?? []}
									totalPages={walletData?.totalPages ?? 0}
								/>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar: Manual discount */}
					<div className="w-full shrink-0 lg:w-80">
						<Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-sage-blue/10 p-2.5">
										<Percent className="h-5 w-5 text-sage-blue" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold text-gray-900">
											{t("discountManagement")}
										</CardTitle>
										<CardDescription className="text-sm">
											{t("discountManagementDescription")}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<ManualDiscountManagement userId={params.id} />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetails;

import { LayoutDashboard, Link2, RefreshCw, Users, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";

import AllWalletLogs from "@/components/dashboard/AllWalletLogs";
import GetProducts from "@/components/dashboard/GetProducts";
import ShopConnect from "@/components/dashboard/ShopConnect";
import UsersTable from "@/components/dashboard/UsersTable";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
	const session = await getServerSession(authOptions);
	if (!session || session.user?.role !== "ADMIN") {
		redirect("/");
	}

	const t = await getTranslations("Dashboard");

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
			<div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<LayoutDashboard className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
								{t("adminDashboard")}
							</h1>
							<p className="text-sm text-muted-foreground mt-0.5">
								{t("adminDashboardDescription")}
							</p>
						</div>
					</div>
				</div>

				{/* Quick Actions Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Store Connection Card */}
					<Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-sage-blue/10 rounded-xl">
									<Link2 className="h-5 w-5 text-sage-blue" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold text-gray-900">
										{t("storeConnect")}
									</CardTitle>
									<CardDescription className="text-sm">
										{t("storeConnectDescription")}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<ShopConnect />
						</CardContent>
					</Card>

					{/* Sync Products Card */}
					<Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-sage-orange/10 rounded-xl">
									<RefreshCw className="h-5 w-5 text-sage-orange" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold text-gray-900">
										{t("syncProducts")}
									</CardTitle>
									<CardDescription className="text-sm">
										{t("syncProductsDescription")}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="flex items-center">
							<GetProducts />
						</CardContent>
					</Card>
				</div>

				{/* Users Section */}
				<Card className="border-0 shadow-md bg-white overflow-hidden">
					<CardHeader className="bg-linear-to-r from-slate-50 to-white border-b">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-primary/10 rounded-xl">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-lg font-semibold text-gray-900">
									{t("users")}
								</CardTitle>
								<CardDescription className="text-sm">
									{t("usersDescription")}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<UsersTable />
					</CardContent>
				</Card>

				{/* Wallet Transactions Section */}
				<Card className="border-0 shadow-md bg-white overflow-hidden">
					<CardHeader className="bg-linear-to-r from-slate-50 to-white border-b">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-gold/10 rounded-xl">
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
						<AllWalletLogs />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

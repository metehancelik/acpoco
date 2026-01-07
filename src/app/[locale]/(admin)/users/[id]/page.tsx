"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import ManualDiscountManagement from "@/components/dashboard/ManualDiscountManagement";
import WalletLogsTable from "@/components/dashboard/WalletLogsTable";
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
		AlertNotification("Something went wrong", "error");
		console.error("Error getting user:", userError);
	}

	if (walletError) {
		AlertNotification("Something went wrong", "error");
		console.error("Error getting wallet logs:", walletError);
	}

	return (
		<div className="max-w-[1280px] mx-auto w-full space-y-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1 space-y-8">
					<div className="flex flex-col md:flex-row gap-8">
						<UserDetailCard user={user || null} />
						<UserBillingAddress billingAddress={user?.billingAddress} />
					</div>
					<WalletLogsTable
						walletLogs={walletData?.logs || []}
						totalPages={walletData?.totalPages || 0}
					/>
				</div>
				<div className="w-full lg:w-80 shrink-0">
					<ManualDiscountManagement userId={params.id} />
				</div>
			</div>
		</div>
	);
};

export default UserDetails;

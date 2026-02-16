"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";

import type { IUserRoot } from "@/app/[locale]/(admin)/users/[id]/page";
import httpClient from "@/utils/httpClient";

import { BalanceChangeModal } from "./BalanceChangeModal";

interface Props {
	user: IUserRoot | null;
}

interface IWallet {
	balance: number;
	userId: string;
}

const formatEur = (value: number) =>
	new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
	}).format(value);

const UserDetailCard: React.FC<Props> = ({ user }) => {
	const t = useTranslations("UserDetail");
	const tDashboard = useTranslations("Dashboard");
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const { data: wallet } = useQuery<IWallet>({
		queryKey: ["userWallet", user?._id],
		queryFn: async () => {
			if (!user?._id) throw new Error("User ID is required");
			const response = await httpClient.get(`wallet/user-wallet/${user._id}`);
			return response.data;
		},
		enabled: !!user?._id,
	});

	const handleModal = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setIsModalOpen(!isModalOpen);
	};

	if (!user) {
		return <p className="text-sm text-muted-foreground">{t("loadingUser")}</p>;
	}

	return (
		<div className="space-y-4 text-sm">
			<div className="flex flex-wrap items-baseline gap-x-2">
				<span className="font-medium text-gray-500">{t("name")}</span>
				<span className="text-gray-900">
					{user.name} {user.surname}
				</span>
			</div>
			<div className="flex flex-wrap items-baseline gap-x-2">
				<span className="font-medium text-gray-500">{t("email")}</span>
				<span className="text-gray-900">{user.email}</span>
			</div>
			<div className="flex flex-wrap items-baseline gap-x-2">
				<span className="font-medium text-gray-500">{t("role")}</span>
				<span className="capitalize text-gray-900">
					{user.role?.toLowerCase()}
				</span>
			</div>
			<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
				<span className="font-medium text-gray-500">
					{tDashboard("balance")}
				</span>
				<span className="font-semibold text-gray-900">
					{formatEur(wallet?.balance ?? 0)}
				</span>
				<button
					type="button"
					onClick={handleModal}
					className="cursor-pointer rounded-lg bg-sage-orange px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-sage-orange focus:ring-offset-2"
				>
					{t("editBalance")}
				</button>
			</div>
			{user.stores && user.stores.length > 0 && (
				<div className="space-y-2">
					<span className="font-medium text-gray-500">{t("stores")}</span>
					<div className="flex flex-wrap gap-2">
						{user.stores.map((store) => (
							<span
								key={store._id}
								className="inline-flex items-center rounded-lg border border-border bg-slate-50/50 px-3 py-1.5 text-gray-900"
							>
								{store.storeName}
							</span>
						))}
					</div>
				</div>
			)}
			<BalanceChangeModal
				isOpen={isModalOpen}
				userId={user._id}
				setIsModalOpen={setIsModalOpen}
			/>
		</div>
	);
};

export default UserDetailCard;

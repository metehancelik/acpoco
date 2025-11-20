"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import type React from "react";
import { useEffect, useState } from "react";

import BillingAddress from "@/components/profile/BillingAddress";
import PasswordChange from "@/components/profile/PasswordChange";
import WalletLogs from "@/components/profile/WalletLogs";
import AlertNotification from "@/utils/alertNotification";
import { classNames } from "@/utils/classNames";

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
			AlertNotification(
				"Profil bilgileriniz başarıyla güncellendi.",
				"success",
			);
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
		<div className="max-w-7xl mx-auto flex flex-col space-y-4 md:space-y-6">
			{/* PROFILE */}
			<div className="w-full flex space-x-4">
				<div className="flex flex-col items-stretch w-full  space-y-4 md:w-1/2">
					<div className="flex flex-col w-full rounded-md bg-gray-100 p-5 space-y-4">
						<p className="font-bold text-primary">Profil Bilgileri</p>
						<div className="flex justify-between items-center bg-white p-3 rounded-md shadow-md">
							<div className="flex items-center">
								<p className="mr-3 text-sm">İsim:</p>
								<input
									type="text"
									id="name"
									name="name"
									value={name}
									onChange={handleChange}
									className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
								/>
							</div>
							<div className="flex items-center">
								<p className="mr-3 text-sm">Soyisim:</p>
								<input
									type="text"
									id="surname"
									name="surname"
									value={surname}
									onChange={handleChange}
									className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
								/>
							</div>
							<button
								onClick={submitHandler}
								className="text-primary px-4 py-1 text-sm flex items-center justify-center space-x-3 border border-primary rounded-md bg-white"
							>
								<PencilSquareIcon width={24} height={24} />
								<p className="font-bold">Düzenle</p>
							</button>
						</div>
						<div className="flex justify-start items-center bg-white text-sm p-3 rounded-md shadow-md">
							<p className="mr-3">Email:</p>
							<p className="w-1/2 text-start">{session.data?.user?.email}</p>
						</div>
						<div
							className={classNames(
								session.data?.user?.role === "ADMIN" ? "w-full" : "w-1/2",
								"flex flex-col rounded-md bg-gray-100 space-y-4",
							)}
						>
							<p className="font-bold text-primary">Mağazalarım</p>

							<div className="w-full space-y-4">
								{stores && stores?.length > 0 ? (
									stores?.map((store, index) => (
										<div
											key={index}
											className="flex justify-between items-center bg-white p-3 rounded-md shadow-md"
										>
											<p>{store?.storeName}</p>
										</div>
									))
								) : (
									<p>Henüz mağaza yok!</p>
								)}
							</div>
						</div>
					</div>

					<PasswordChange />
				</div>

				{/* BILLING ADDRESS */}
				<BillingAddress />
			</div>
			{/* WALLET LOGS */}
			<WalletLogs />
		</div>
	);
};

export default Profile;

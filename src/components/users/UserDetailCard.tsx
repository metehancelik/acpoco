"use client";

import { useQuery } from "@tanstack/react-query";
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

const UserDetailCard: React.FC<Props> = ({ user }) => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	// const [productPriceRate, setProductPriceRate] = React.useState(
	//   user?.productPriceRate || 2,
	// );
	// const [shippingPriceRate, setShippingPriceRate] = React.useState(
	//   user?.shippingPriceRate || 2,
	// );
	// const [warehousePriceRate, setWarehousePriceRate] = React.useState(
	//   user?.warehousePriceRate || 2,
	// );

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

	// const handleSubmitProductPriceRate = async (e: React.SyntheticEvent) => {
	//   e.preventDefault();
	//   try {
	//     await httpClient.put(`users/${user?._id}/product-rate`, {
	//       productPriceRate,
	//     });
	//     AlertNotification("Ürün fiyat çarpanı başarıyla güncellendi", "success");
	//   } catch (error) {
	//     console.error(error);
	//     AlertNotification("Bir hata oluştu", "error");
	//   }
	// };
	// const handleSubmitShippingPriceRate = async (e: React.SyntheticEvent) => {
	//   e.preventDefault();
	//   try {
	//     await httpClient.put(`users/${user?._id}/shipping-rate`, {
	//       shippingPriceRate,
	//     });
	//     AlertNotification("Kargo fiyat çarpanı başarıyla güncellendi", "success");
	//   } catch (error: unknown) {
	//     console.error(error);
	//     AlertNotification("Bir hata oluştu", "error");
	//   }
	// };
	// const handleSubmitWarehousePriceRate = async (e: React.SyntheticEvent) => {
	//   e.preventDefault();
	//   try {
	//     await httpClient.put(`users/${user?._id}/warehouse-rate`, {
	//       warehousePriceRate,
	//     });
	//     AlertNotification("Depo fiyat çarpanı başarıyla güncellendi", "success");
	//   } catch (error: unknown) {
	//     console.error(error);
	//     AlertNotification("Bir hata oluştu", "error");
	//   }
	// };

	// useEffect(() => {
	//   setProductPriceRate(user?.productPriceRate || 2);
	//   setShippingPriceRate(user?.shippingPriceRate || 2);
	//   setWarehousePriceRate(user?.warehousePriceRate || 2);
	// }, [user]);

	return (
		<div className="w-1/2 flex flex-col space-y-6 bg-gray-50 p-4 rounded-md shadow-md text-text-primary">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold text-primary">
					Kullanıcı Bilgileri
				</h1>
			</div>
			<div className="flex space-x-3 items-center">
				<h2 className="text-sm font-semibold">İsim:</h2>
				<p>{user?.name}</p>
				<p>{user?.surname}</p>
			</div>
			<div className="flex space-x-3 items-center">
				<h2 className="text-sm font-semibold">Email:</h2>
				<p>{user?.email}</p>
			</div>
			<div className="flex space-x-3 items-center">
				<h2 className="text-sm font-semibold">Rol:</h2>
				<p>{user?.role}</p>
			</div>

			<div className="flex space-x-3 items-center">
				<h2 className="text-sm font-semibold">Bakiye:</h2>
				<p>{wallet?.balance || 0}</p>
				<button
					onClick={handleModal}
					className="bg-sage-orange text-white rounded-md py-1 px-4 hover:bg-orange-400"
				>
					Bakiye Düzenle
				</button>
			</div>
			<div className="flex space-x-3 items-center">
				<h2 className="text-base font-semibold">Mağazalar:</h2>
				{user?.stores.map((store) => (
					<p key={store._id}>{store.storeName}</p>
				))}
			</div>
			<BalanceChangeModal
				isOpen={isModalOpen}
				userId={user?._id || ""}
				setIsModalOpen={setIsModalOpen}
			/>
		</div>
	);
};

export default UserDetailCard;

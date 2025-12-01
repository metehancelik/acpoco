"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface Shop {
	_id: string;
	storeName: string;
	marketplaceName: string;
}

interface User {
	_id: string;
	name: string;
	email: string;
}

interface FormValues {
	shopId: string;
	userId: string;
}

const ShopConnect = () => {
	const queryClient = useQueryClient();
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			shopId: "",
			userId: "",
		},
	});

	const { data: shops, isLoading: isLoadingShops } = useQuery({
		queryKey: ["mystores"],
		queryFn: () => httpClient.get("stores/mystores").then((res) => res.data),
	});

	const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => httpClient.get("users").then((res) => res.data),
	});

	const connectStoreMutation = useMutation({
		mutationFn: async ({ shopId, userId }: FormValues) => {
			const response = await httpClient.post("stores/connect-store", {
				shopId,
				userId,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mystores"] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("Mağaza başarıyla bağlandı");
			reset();
		},
		onError: (error: unknown) => {
			const errorMessage =
				error &&
				typeof error === "object" &&
				"response" in error &&
				error.response &&
				typeof error.response === "object" &&
				"data" in error.response &&
				error.response.data &&
				typeof error.response.data === "object" &&
				"message" in error.response.data &&
				typeof error.response.data.message === "string"
					? error.response.data.message
					: "Mağaza bağlanırken bir hata oluştu";
			toast.error(errorMessage);
		},
	});

	const isLoading =
		isLoadingShops || isLoadingUsers || connectStoreMutation.isPending;

	const onSubmit = (data: FormValues) => {
		if (!data.shopId || !data.userId) {
			toast.error("Lütfen mağaza ve kullanıcı seçiniz");
			return;
		}

		connectStoreMutation.mutate(data);
	};

	return (
		<form
			className="flex gap-2 lg:gap-4 items-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="shopId"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<Select
						disabled={isLoading}
						onValueChange={field.onChange}
						value={field.value}
					>
						<SelectTrigger>
							<SelectValue placeholder="Mağaza seçiniz" />
						</SelectTrigger>
						<SelectContent>
							{shops?.stores?.map((shop: Shop) => (
								<SelectItem key={shop._id} value={shop._id}>
									{shop.storeName} - ({shop.marketplaceName})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			<Controller
				name="userId"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<Select
						disabled={isLoading}
						onValueChange={field.onChange}
						value={field.value}
					>
						<SelectTrigger>
							<SelectValue placeholder="Kullanıcı seçiniz" />
						</SelectTrigger>
						<SelectContent>
							{users?.map((user) => (
								<SelectItem key={user._id} value={user._id}>
									{user.name} ({user.email})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			<Button type="submit" disabled={isLoading}>
				Onayla
			</Button>
		</form>
	);
};

export default ShopConnect;

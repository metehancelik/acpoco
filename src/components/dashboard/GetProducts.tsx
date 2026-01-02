"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Button } from "../ui/button";

const GetProducts = () => {
	const t = useTranslations("Dashboard");
	const router = useRouter();

	const { mutate: syncProducts, isPending } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.get("/api/admin/shopify-products");
			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message || t("syncSuccess"));
			router.refresh();
		},
		onError: (error: AxiosError<unknown>) => {
			const data = error.response?.data as { details?: string } | undefined;
			const message = data?.details || error.message || t("syncError");
			toast.error(`${t("syncError")}: ${message}`);
		},
	});

	return (
		<Button
			onClick={() => syncProducts()}
			disabled={isPending}
			className="gap-2 min-w-[160px]"
			variant="outline"
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<RefreshCw className="h-4 w-4" />
			)}
			{isPending ? t("syncing") : t("getProducts")}
		</Button>
	);
};

export default GetProducts;

"use client";

import axios from "axios";
import { useTranslations } from "next-intl";

import { Button } from "../ui/button";

const GetProducts = () => {
	const t = useTranslations("Dashboard");

	const handleGetProducts = async () => {
		await axios.get("/api/admin/shopify-products");
	};

	return <Button onClick={handleGetProducts}>{t("getProducts")}</Button>;
};

export default GetProducts;

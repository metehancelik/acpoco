"use client";
import axios from "axios";
import React from "react";

import { Button } from "../ui/button";

const GetProducts = () => {
  const handleGetProducts = async () => {
    await axios.get("/api/admin/shopify-products");
  };

  return <Button onClick={handleGetProducts}>Ürünleri Getir</Button>;
};

export default GetProducts;

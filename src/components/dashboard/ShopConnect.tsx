"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

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

const ShopConnect = () => {
  const [shopId, setShopId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { data: shops, isLoading: isLoadingShops } = useQuery({
    queryKey: ["mystores"],
    queryFn: () => httpClient.get("stores/mystores").then((res) => res.data),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => httpClient.get("users").then((res) => res.data),
  });

  const isLoading = isLoadingShops || isLoadingUsers;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await httpClient.post("stores/connect-store", { shopId, userId });
  };

  return (
    <form className="flex gap-2 lg:gap-4 items-center" onSubmit={handleSubmit}>
      <Select disabled={isLoading} onValueChange={setShopId}>
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

      <Select disabled={isLoading} onValueChange={setUserId}>
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

      <Button type="submit" disabled={isLoading}>
        Connect
      </Button>
    </form>
  );
};

export default ShopConnect;

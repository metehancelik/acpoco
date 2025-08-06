"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FormValues = {
  country: string;
  countryCode: string;
  price: number;
};

const WarehouseCreateForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      country: "",
      countryCode: "",
      price: 0,
    },
  });

  const queryClient = useQueryClient();
  const createWarehouse = async (data: FormValues) => {
    await httpClient.post(`/warehouse`, {
      country: data.country,
      countryCode: data.countryCode,
      price: Number(data.price),
    });
  };
  const mutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
      <Input {...form.register("country")} placeholder="Ülke" />
      <Input {...form.register("countryCode")} placeholder="Ülke Kodu" />
      <Input {...form.register("price")} placeholder="Fiyat" />
      <Button type="submit">Create</Button>
    </form>
  );
};

export default WarehouseCreateForm;

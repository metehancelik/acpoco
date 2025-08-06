"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormValues = {
  country: string;
  countryCode: string;
  price: number;
};

type WarehouseUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  warehouse: {
    _id: string;
    country: string;
    countryCode: string;
    price: number;
  } | null;
};

const WarehouseUpdateModal = ({
  isOpen,
  onClose,
  warehouse,
}: WarehouseUpdateModalProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      country: warehouse?.country || "",
      countryCode: warehouse?.countryCode || "",
      price: warehouse?.price || 0,
    },
  });

  const queryClient = useQueryClient();

  const updateWarehouse = async (data: FormValues) => {
    if (!warehouse?._id) return;

    await httpClient.patch(`/warehouse`, {
      id: warehouse._id,
      country: data.country,
      countryCode: data.countryCode,
      price: Number(data.price),
    });
  };

  const mutation = useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  // Reset form when warehouse data changes
  React.useEffect(() => {
    if (warehouse) {
      form.reset({
        country: warehouse.country,
        countryCode: warehouse.countryCode,
        price: warehouse.price,
      });
    }
  }, [warehouse, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ara Depo Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="country">Ülke</Label>
            <Input
              id="country"
              {...form.register("country", { required: "Ülke adı gerekli" })}
              placeholder="Ülke adını girin"
            />
            {form.formState.errors.country && (
              <span className="text-sm text-red-500">
                {form.formState.errors.country.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="countryCode">Ülke Kodu</Label>
            <Input
              id="countryCode"
              {...form.register("countryCode", {
                required: "Ülke kodu gerekli",
              })}
              placeholder="TR, US, GB..."
            />
            {form.formState.errors.countryCode && (
              <span className="text-sm text-red-500">
                {form.formState.errors.countryCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Fiyat</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...form.register("price", {
                required: "Fiyat gerekli",
                min: { value: 0, message: "Fiyat 0'dan büyük olmalı" },
              })}
              placeholder="0.00"
            />
            {form.formState.errors.price && (
              <span className="text-sm text-red-500">
                {form.formState.errors.price.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseUpdateModal;

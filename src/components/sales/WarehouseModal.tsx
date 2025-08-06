"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import { OrderWithPopulatedItems } from "@/lib/shipstation/types";
import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  isWarehouseModalOpen: boolean;
  setIsWarehouseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  order: OrderWithPopulatedItems & { _id: string };
}

type FormValues = {
  trackingNumber: string;
  shippingService: string;
};

const WarehouseModal: React.FC<Props> = ({
  isWarehouseModalOpen,
  setIsWarehouseModalOpen,
  order,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      trackingNumber: "",
      shippingService: "",
    },
  });

  const queryClient = useQueryClient();

  const updateOrder = async (data: FormValues) => {
    await httpClient.patch(`/orders/shipping/${order._id}`, {
      trackingNumber: data.trackingNumber,
      shippingService: data.shippingService,
    });
  };

  const mutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsWarehouseModalOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    setIsWarehouseModalOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isWarehouseModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kargo Bilgileri</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trackingNumber">Takip Numarası</Label>
            <Input
              id="trackingNumber"
              placeholder="Takip numarasını girin"
              {...form.register("trackingNumber", {
                required: "Takip numarası gerekli",
              })}
            />
            {form.formState.errors.trackingNumber && (
              <span className="text-sm text-red-500">
                {form.formState.errors.trackingNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shippingService">Kargo Servisi</Label>
            <Input
              id="shippingService"
              placeholder="Kargo servisini girin"
              {...form.register("shippingService", {
                required: "Kargo servisi gerekli",
              })}
            />
            {form.formState.errors.shippingService && (
              <span className="text-sm text-red-500">
                {form.formState.errors.shippingService.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              İptal
            </Button>
            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseModal;

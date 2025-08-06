import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import AlertNotification from "@/utils/alertNotification";
import { formatStatus } from "@/utils/formatStatus";
import httpClient from "@/utils/httpClient";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";

interface ConfirmStatusChangeProps {
  status: string;
  isAllSelected: boolean;
  orderIds?: string[];
  open: boolean;
  onClose: () => void;
}

const ConfirmStatusChange = ({
  status,
  isAllSelected,
  orderIds,
  open,
  onClose,
}: ConfirmStatusChangeProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await httpClient.patch("/orders/supplier", {
        orderIds,
        changedStatus: status,
        isAllSelected,
        query: isAllSelected, // if using query for all selected case
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // to refresh orders list
      AlertNotification("Status successfully updated", "success");
      onClose();
    },
    onError: () => {
      AlertNotification("Failed to update status", "error");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Durum Değiştirme</DialogTitle>
          <DialogDescription>
            <p>
              {isAllSelected
                ? "Tüm siparişlerin durumunu"
                : `Seçilen ${orderIds?.length} adet siparişin durumunu`}
            </p>
            <p>
              {formatStatus(status)} olarak değiştirmek istediğinize emin
              misiniz?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="bg-danger text-white">
            Kapat
          </Button>
          <Button
            className="bg-primary text-white"
            onClick={() => mutation.mutate()}
          >
            Onayla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmStatusChange;

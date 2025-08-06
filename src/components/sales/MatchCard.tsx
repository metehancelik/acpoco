"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import debounce from "debounce";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipStationOrderItem } from "@/lib/shipstation/types";
import { IProduct } from "@/models/Product";
import httpClient from "@/utils/httpClient";

import { AlertNotification } from "../shared/AlertNotification";

interface MatchCardProps {
  orderId: string;
  orderItem: Omit<ShipStationOrderItem, "matchId"> & {
    matchId?: IProduct;
  };
  orderStatus: string;
}

export function MatchCard({ orderId, orderItem, orderStatus }: MatchCardProps) {
  const session = useSession();
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const queryClient = useQueryClient();

  // Debounce the input value to avoid too many API requests
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(inputValue);
    }, 1000);

    handler();

    return () => handler.clear();
  }, [inputValue]);

  const { data } = useQuery({
    queryKey: ["products", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return { products: [] };
      const response = await httpClient.get<{ products: IProduct[] }>(
        `/products?query=${debouncedQuery}`,
      );

      return response.data;
    },
    enabled: debouncedQuery.length > 0,
  });

  const products = data?.products || [];

  const handleItemClick = (item: IProduct) => {
    setSelectedProduct(item);
  };

  const updateMatchMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) return;

      return httpClient.post(`/orders/${orderId}/`, {
        orderItemId: orderItem.orderItemId,
        selectedAttributes,
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      AlertNotification({
        message: "Ürün eşleştirildi",
        type: "success",
      });
    },
  });

  const handleSave = () => {
    if (!selectedProduct) return;
    updateMatchMutation.mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {!orderItem.matchId &&
          session.data?.user?.role === "SELLER" &&
          orderStatus === "waitingMatch" && (
            <Button className="bg-red-500 text-white hover:bg-red-600 h-auto px-2.5 py-0.5 text-xs font-semibold">
              Eşleştir
            </Button>
          )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ürün Eşleştirme</DialogTitle>
          <DialogDescription>
            Ürün eslestirmek icin arama yapiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4">
            <Input
              id="query"
              placeholder="Ürün arama"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {!selectedProduct ? (
            products.map((product) => (
              <div
                onClick={() => handleItemClick(product)}
                key={product.parentSku}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md bg-gray-50"
              >
                {product.parentSku} - {product.title}
              </div>
            ))
          ) : (
            <>
              <div className="p-2 rounded-md bg-gray-50">
                {selectedProduct.parentSku} - {selectedProduct.category.name}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.attributes.map((attribute) => (
                  <Select
                    key={attribute.name}
                    defaultValue={selectedAttributes[attribute.name]}
                    onValueChange={(value) => {
                      setSelectedAttributes((prev) => ({
                        ...prev,
                        [attribute.name]: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="col-span-1">
                      <SelectValue placeholder={attribute.name} />
                    </SelectTrigger>
                    <SelectContent>
                      {attribute.values.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={updateMatchMutation.isPending || !selectedProduct}
            >
              {updateMatchMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

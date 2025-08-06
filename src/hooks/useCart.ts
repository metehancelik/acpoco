import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IProductVariant } from "@/models/ProductVariant";
import AlertNotification from "@/utils/alertNotification";
import httpClient from "@/utils/httpClient";

interface CartItem extends IProductVariant {
  count: number;
}

interface CartResponse {
  cart: CartItem[];
}

interface CartMutationParams {
  productVariantId: string;
  quantity: number;
}

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await httpClient.get("cart");

      return response.data;
    },
  });

  const addToCart = useMutation({
    mutationFn: async ({ productVariantId, quantity }: CartMutationParams) => {
      try {
        const response = await httpClient.post("cart", {
          productVariantId,
          quantity,
        });
        AlertNotification("Ürün sepete eklendi", "success");

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          AlertNotification(
            error.message || "Ürün sepete eklenirken bir hata oluştu",
            "error",
          );
        } else {
          AlertNotification("Ürün sepete eklenirken bir hata oluştu", "error");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async ({ productVariantId, quantity }: CartMutationParams) => {
      try {
        const response = await httpClient.patch("cart", {
          productVariantId,
          quantity,
        });
        AlertNotification("Sepet güncellendi", "success");

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          AlertNotification(
            error.message || "Sepet güncellenirken bir hata oluştu",
            "error",
          );
        } else {
          AlertNotification("Sepet güncellenirken bir hata oluştu", "error");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (productVariantId: string) => {
      try {
        const response = await httpClient.delete("cart", {
          data: { productVariantId },
        });
        AlertNotification("Ürün sepetten kaldırıldı", "success");

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          AlertNotification(
            error.message || "Ürün sepetten kaldırılırken bir hata oluştu",
            "error",
          );
        } else {
          AlertNotification(
            "Ürün sepetten kaldırılırken bir hata oluştu",
            "error",
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const cartItemsCount =
    data?.cart?.reduce((acc, item) => acc + item.count, 0) || 0;
  const cartTotalPrice =
    data?.cart?.reduce((acc, item) => acc + item.price * item.count, 0) || 0;

  return {
    cart: data?.cart || [],
    isLoading,
    error,
    cartItemsCount,
    cartTotalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
  };
};

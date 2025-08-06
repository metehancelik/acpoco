import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useCartStore } from "@/store/useCartStore";
import { hydrateCartStore } from "@/utils/hydrateStore";

import { useCart } from "./useCart";

export const useCartSync = () => {
  const { status } = useSession();
  const { addToCart } = useCart();
  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore((state) => state.clearCart);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate the store on mount
  useEffect(() => {
    hydrateCartStore();
    setMounted(true);
  }, []);

  // Transfer cart items to user's cart when they log in
  useEffect(() => {
    // Check if user just logged in (previous status was unauthenticated, current is authenticated)
    if (
      previousStatus === "unauthenticated" &&
      status === "authenticated" &&
      items.length > 0
    ) {
      // Transfer each item to the user's cart
      const transferPromises = items.map((item) =>
        addToCart.mutateAsync({
          productVariantId: item._id,
          quantity: item.count,
        }),
      );

      // Clear the local cart after all transfers are complete
      Promise.all(transferPromises)
        .then(() => {
          clearCart();
        })
        .catch(() => {
          // Handle error if needed
        });
    }

    // Update previous session status
    setPreviousStatus(status);
  }, [status, items, addToCart, clearCart, previousStatus]);

  return { mounted };
};

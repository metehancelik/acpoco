import { useCartStore } from "@/store/useCartStore";

export const hydrateCartStore = () => {
  try {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart-storage");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (parsedCart && parsedCart.state && parsedCart.state.items) {
          const store = useCartStore.getState();
          store.items = parsedCart.state.items;
        }
      }
    }
  } catch (error) {
    console.error("Failed to hydrate cart store:", error);
  }
};

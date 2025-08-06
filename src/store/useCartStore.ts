import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

import { IProductVariant } from "@/models/ProductVariant";

interface CartItem extends Partial<IProductVariant> {
  _id: string;
  count: number;
}
interface CartStore {
  items: CartItem[];
  // eslint-disable-next-line no-unused-vars
  addItem: (productId: string, quantity: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateItem: (productId: string, quantity: number) => void;
  // eslint-disable-next-line no-unused-vars
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemsCount: () => number;
}

type CartPersist = (
  // eslint-disable-next-line no-unused-vars
  config: StateCreator<CartStore>,
  // eslint-disable-next-line no-unused-vars
  options: PersistOptions<CartStore>,
) => StateCreator<CartStore>;

export const useCartStore = create<CartStore>()(
  (persist as CartPersist)(
    (set, get) => ({
      items: [],
      addItem: (productVariantId: string, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === productVariantId,
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === productVariantId
                  ? { ...item, count: item.count + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { _id: productVariantId, count: quantity }],
          };
        });
      },
      updateItem: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        }));
      },
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      clearCart: () => set({ items: [] }),
      itemsCount: () => {
        const state = get();

        return state.items.reduce((total, item) => total + item.count, 0);
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    },
  ),
);

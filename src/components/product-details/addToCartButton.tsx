"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React from "react";

import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";

type AddToCartButtonProps = {
  productId: string;
};

const AddToCartButton = ({ productId }: AddToCartButtonProps) => {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (session) {
      addToCart.mutate({ productVariantId: productId, quantity: 1 });
    } else {
      addItem(productId, 1);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={session ? addToCart.isPending : false}
      className="flex max-w-xs flex-1 items-center space-x-2 justify-center rounded-md border border-transparent bg-sageOrange px-8 py-3 text-base font-medium text-white hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <p>{session && addToCart.isPending ? "Ekleniyor..." : "Sepete Ekle"}</p>
      <ShoppingCartIcon height={24} width={24} />
    </button>
  );
};

export default AddToCartButton;

"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/useCartStore";

export type CartItemType = {
  _id: string;
  productId: {
    _id: string;
    images: string[];
    title: string;
  };
  childSku: string;
  price: number;
  attributes: { name: string; value: string[] }[];
  count: number;
};

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { data: session } = useSession();
  const { updateCartItem, removeFromCart } = useCart();
  const { updateItem, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState("count" in item ? item.count : 1);

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (session) {
      updateCartItem.mutate({
        productVariantId: "_id" in item ? item._id : "",
        quantity: newQuantity,
      });
    } else {
      updateItem("productId" in item ? item.productId._id : item, newQuantity);
    }
    setQuantity(newQuantity);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      if (session) {
        updateCartItem.mutate({
          productVariantId: "_id" in item ? item._id : "",
          quantity: newQuantity,
        });
      } else {
        updateItem("productId" in item ? item.productId._id : "", newQuantity);
      }
      setQuantity(newQuantity);
    } else {
      if (session) {
        removeFromCart.mutate("_id" in item ? item._id : "");
      } else {
        removeItem("productId" in item ? item.productId._id : "");
      }
    }
  };

  return (
    <div className="flex rounded-lg w-full border border-slate-400 shadow-md p-2 mb-2 items-center gap-2">
      <div className="w-full flex justify-center">
        <Image
          src={item.productId.images[0]}
          alt={item.productId.title}
          className="w-16 h-16 object-cover object-center rounded-md"
          width={100}
          height={100}
        />
      </div>
      <p className="text-sm font-medium text-center w-full">
        {item.productId.title}
      </p>
      <p className="text-xs font-medium text-center w-full">{item.childSku}</p>
      <div className="text-xs font-medium w-full">
        {item.attributes.map((attribute: { name: string; value: string[] }) => (
          <p key={attribute.name}>
            {attribute.name}: {attribute.value}
          </p>
        ))}
      </div>
      <p className="text-sm font-bold text-center w-full">${item.price}</p>
      <div className="flex items-center space-x-2 w-full">
        <button
          onClick={handleDecreaseQuantity}
          disabled={
            session
              ? updateCartItem.isPending || removeFromCart.isPending
              : false
          }
          className="text-sm font-medium p-2 rounded-md bg-slate-200 h-5 w-5 flex items-center justify-center hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <p className="text-sm font-medium w-full text-center">{quantity}</p>
        <button
          onClick={handleIncreaseQuantity}
          disabled={session ? updateCartItem.isPending : false}
          className="text-sm font-medium p-2 rounded-md bg-slate-200 h-5 w-5 flex items-center justify-center hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <div className="flex items-center justify-center space-x-4 w-full">
        <p className="text-sm font-bold text-center">
          ${item.price * quantity}{" "}
        </p>
        <Trash2
          className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-600"
          onClick={() => {
            if (session) {
              removeFromCart.mutate("_id" in item ? item._id : "");
            }
          }}
        />
      </div>
    </div>
  );
};

export default CartItem;

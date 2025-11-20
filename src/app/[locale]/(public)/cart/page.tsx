"use client";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import CartItem, { type CartItemType } from "@/components/cart/CartItem";
import Loading from "@/components/shared/Loading";
// import { useNotification } from "@/context/NotificationContext";
import { useCart } from "@/hooks/useCart";
import { useCartSync } from "@/hooks/useCartSync";
// import { IProductVariant } from "@/models/ProductVariant";
import { useCartStore } from "@/store/useCartStore";
import httpClient from "@/utils/httpClient";

// import { PaymentRequest, PaymentItem } from "@/types/payment";

// type CartItemType = IProductVariant & { count: number };

const CartPage = () => {
	const { data: session } = useSession();
	const { cart, isLoading, cartTotalPrice } = useCart();
	const items = useCartStore((state) => state.items);
	const { mounted } = useCartSync();
	const { data: localItems } = useQuery({
		queryKey: ["localItems"],
		queryFn: async () => {
			const response = await httpClient.post("product-variants", {
				productVariantIds: items.map((item) => item._id),
			});

			return response.data;
		},
		enabled: !session && items.length > 0,
	});

	// const { showNotification } = useNotification();

	// const { data: billingAddress } = useQuery({
	//   queryKey: ["billingAddress"],
	//   queryFn: async () => {
	//     const res = await axios.get("/api/users/billing-address");

	//     return res.data;
	//   },
	//   enabled: !!session?.user,
	// });

	// const handlePayment = async () => {
	//   try {
	//     if (!billingAddress) {
	//       showNotification("Lütfen önce fatura bilgilerinizi giriniz", "error");

	//       return;
	//     }

	//     const paymentItems: PaymentItem[] = cartItems.map((item) => {
	//       if ("_id" in item) {
	//         return {
	//           _id: item._id,
	//           name: item.title,
	//           price: item.price,
	//           quantity: item.count,
	//         };
	//       }

	//       return {
	//         productId: item.productId,
	//         name: item.title || "Unknown Product",
	//         price: item.price || 0,
	//         quantity: item.quantity,
	//       };
	//     });

	//     const paymentRequest: PaymentRequest = {
	//       items: paymentItems,
	//       totalPrice,
	//       billingAddress: billingAddress,
	//     };

	//     const response = await axios.post("/api/payment", paymentRequest);

	//     if (response.data.status === "success" && response.data.paymentPageUrl) {
	//       window.location.href = response.data.paymentPageUrl;
	//     } else {
	//       showNotification("Ödeme başlatılırken bir hata oluştu", "error");
	//     }
	//   } catch (error) {
	//     console.error(error);
	//     showNotification("Ödeme başlatılırken bir hata oluştu", "error");
	//   }
	// };

	if (!mounted || (session && isLoading)) return <Loading size={100} />;

	const cartItems = session ? cart : localItems;
	const totalPrice = session ? cartTotalPrice : 0; // Price will be calculated in CartItem component for local cart

	return (
		<div className="w-full max-w-6xl mx-auto mt-8 lg:mt-12 min-h-screen">
			<div className="flex flex-col lg:flex-row lg:space-x-4">
				<div className="w-full">
					<div className="flex p-2 items-center w-full mb-2">
						<p className="font-semibold text-sm w-full text-center">
							Ürün Görseli
						</p>
						<p className="font-semibold text-sm w-full text-center">Ürün Adı</p>
						<p className="font-semibold text-sm w-full text-center">SKU</p>
						<p className="font-semibold text-sm w-full text-center">
							Ürün Özellikleri
						</p>
						<p className="font-semibold text-sm w-full text-center">Fiyat</p>
						<p className="font-semibold text-sm w-full text-center">Adet</p>
						<p className="font-semibold text-sm w-full text-center">
							Toplam Fiyat
						</p>
					</div>
					{cartItems?.map((item: CartItemType) => (
						<CartItem key={item._id} item={item} />
					))}
				</div>

				{/* {session && <BillingAddress />} */}
			</div>

			<div className="w-full flex justify-end items-center space-x-4 mt-4">
				<p className="text-xl font-bold">Toplam Fiyat: ${totalPrice}</p>
				{/* {session ? (
          <button
            onClick={handlePayment}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Ödeme Yap
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Giriş Yap ve Devam Et
          </button>
        )} */}
			</div>
		</div>
	);
};

export default CartPage;

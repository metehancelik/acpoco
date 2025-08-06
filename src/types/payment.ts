export interface PaymentItem {
  _id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  gsmNumber: string;
  identityNumber: string;
  addressLine1: string;
  city: string;
  country: string;
}

export interface PaymentRequest {
  items: PaymentItem[];
  totalPrice: number;
  billingAddress: BillingAddress;
}

export interface PaymentResponse {
  status: string;
  paymentPageUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}

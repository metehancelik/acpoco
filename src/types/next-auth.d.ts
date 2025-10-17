import { BillingAddress } from "./payment";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    billingAddress?: BillingAddress;
    discountPercent?: number;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    surname?: string;
    balance?: number;
    cart?: string[];
    discountPercent?: number;
  }
}

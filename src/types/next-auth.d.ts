import { BillingAddress } from "./payment";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    billingAddress?: BillingAddress;
  }

  interface Session {
    user: User;
  }
}

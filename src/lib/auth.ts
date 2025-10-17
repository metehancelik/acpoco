import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }
        const isPasswordValid = await user.comparePassword(
          credentials.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: user.role,
          balance: user.balance,
          cart: user.cart,
          discountPercent: user.discountPercent || 0,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.surname = user.surname;
        token.balance = user.balance;
        token.cart = user.cart;
        token.discountPercent = user.discountPercent || 0;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = (token.id || token.sub) as string;
        session.user.balance = token.balance as number;
        session.user.surname = token.surname as string;
        session.user.cart = token.cart as string[];
        session.user.discountPercent = token.discountPercent || 0;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

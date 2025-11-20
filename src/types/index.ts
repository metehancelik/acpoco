import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		role?: string;
		balance?: number;
		surname?: string;
		cart?: string[];
	}
	interface Session extends DefaultSession {
		user: User;
	}
}

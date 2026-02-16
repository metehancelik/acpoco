"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	TruckIcon,
	UserCircleIcon,
} from "@heroicons/react/20/solid";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ProfileDropdown = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const t = useTranslations("Common");
	const tNav = useTranslations("Navigation");

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await signOut({ callbackUrl: "/" });
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		}
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<MenuButton className="inline-flex items-center gap-x-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:ring-gold/50 transition-all duration-200 group">
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center">
						<UserCircleIcon className="w-5 h-5 text-white" />
					</div>
					<span className="group-hover:text-gold transition-colors">
						{t("myAccount")}
					</span>
					<ChevronDownIcon
						aria-hidden="true"
						className="h-5 w-5 text-gray-400 group-hover:text-gold transition-colors"
					/>
				</MenuButton>
			</div>

			<MenuItems
				transition
				className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 focus:outline-none data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in overflow-hidden"
			>
				<div className="py-1">
					<MenuItem>
						{({ focus }) => (
							<Link
								href="/profile"
								className={`${
									focus ? "bg-gold/10 text-gold" : "text-gray-700"
								} flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150`}
							>
								<UserCircleIcon className="w-5 h-5" />
								{t("profile")}
							</Link>
						)}
					</MenuItem>
					<MenuItem>
						{({ focus }) => (
							<Link
								href="/sales"
								className={`${
									focus ? "bg-gold/10 text-gold" : "text-gray-700"
								} flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150`}
							>
								<TruckIcon className="w-5 h-5" />
								{tNav("supplySystem")}
							</Link>
						)}
					</MenuItem>
				</div>

				<div className="py-1">
					<MenuItem>
						{({ focus }) => (
							<button
								type="button"
								onClick={handleLogout}
								disabled={isLoggingOut}
								className={`${
									focus ? "bg-red-50 text-red-600" : "text-gray-700"
								} flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-150 disabled:opacity-50`}
							>
								{isLoggingOut ? (
									<>
										<Loader2 className="h-5 w-5 animate-spin" aria-hidden />
										{t("loggingOut")}
									</>
								) : (
									<>
										<ArrowRightStartOnRectangleIcon className="w-5 h-5" />
										{t("logout")}
									</>
								)}
							</button>
						)}
					</MenuItem>
				</div>
			</MenuItems>
		</Menu>
	);
};

export default ProfileDropdown;

"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import {
	ArrowRightStartOnRectangleIcon,
	Bars3Icon,
	GiftIcon,
	HeartIcon,
	PresentationChartBarIcon,
	TagIcon,
	TruckIcon,
	UserCircleIcon,
	WalletIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/routing";
import { classNames } from "@/utils/classNames";
import httpClient from "@/utils/httpClient";

import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import BalanceModal from "../sales/BalanceModal";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Sidebar() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const session = useSession();
	const location = usePathname();
	const t = useTranslations("Navigation");
	const tCommon = useTranslations("Common");
	const tWallet = useTranslations("Wallet");

	const navigation = [{ name: t("products"), href: "/", icon: GiftIcon }];
	if (session?.data?.user) {
		const item = {
			name: session?.data?.user.role === "ADMIN" ? t("orders") : t("myOrders"),
			href:
				session?.data?.user.role === "ADMIN"
					? "/sales?status=waitingProduction"
					: "/sales",
			icon: TruckIcon,
		};
		navigation.unshift(item);
	}
	if (session?.data?.user.role === "SELLER") {
		navigation.push({
			name: tCommon("profile"),
			href: "/profile",
			icon: UserCircleIcon,
		});
		navigation.push({
			name: tCommon("favorites"),
			href: "/favorites",
			icon: HeartIcon,
		});
	}
	const { data: wallet } = useQuery({
		queryKey: ["wallet"],
		queryFn: () => httpClient.get(`/wallet/user-wallet`),
	});

	const getLocationAfterLocale = (locale: string) => {
		const parts = locale.split("/");
		return `/${parts.slice(2).join("/")}`;
	};

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
		<div>
			<Dialog
				open={sidebarOpen}
				onClose={setSidebarOpen}
				className="relative z-50 lg:hidden"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
				/>

				<div className="fixed inset-0 flex">
					<DialogPanel
						transition
						className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
					>
						<TransitionChild>
							<div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
								<button
									type="button"
									onClick={() => setSidebarOpen(false)}
									className="-m-2.5 p-2.5 hover:bg-white/10 rounded-full transition-colors"
								>
									<span className="sr-only">{tCommon("closeSidebar")}</span>
									<XMarkIcon
										aria-hidden="true"
										className="h-6 w-6 text-white"
									/>
								</button>
							</div>
						</TransitionChild>
						{/* Sidebar component */}
						<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-gray-100 pt-4 shadow-2xl">
							<div className="flex justify-end">
								<LocaleSwitcher />
							</div>
							<nav className="flex flex-1 flex-col">
								<ul className="flex flex-1 flex-col gap-y-7">
									<li>
										<ul className="-mx-2 space-y-1">
											{navigation.map((item) => {
												return (
													<li key={item.name}>
														<Link
															href={item.href}
															onClick={() => setSidebarOpen(false)}
															className={classNames(
																item.href === getLocationAfterLocale(location!)
																	? "bg-gold/10 text-gold"
																	: "text-gray-700 hover:bg-gold/10 hover:text-gold",
																"group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200",
															)}
														>
															<item.icon
																aria-hidden="true"
																className="h-6 w-6 shrink-0"
															/>
															{item.name}
														</Link>
													</li>
												);
											})}
											{session?.data?.user?.role === "ADMIN" && (
												<li>
													<Link
														href={"/dashboard"}
														onClick={() => setSidebarOpen(false)}
														className={classNames(
															"/dashboard" === getLocationAfterLocale(location!)
																? "bg-gold/10 text-gold"
																: "text-gray-700 hover:bg-gold/10 hover:text-gold",
															"group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200",
														)}
													>
														<PresentationChartBarIcon width={24} height={24} />{" "}
														{t("dashboard")}
													</Link>
												</li>
											)}
											{session?.data?.user?.role === "ADMIN" && (
												<li>
													<Link
														href={"/discount-requests"}
														onClick={() => setSidebarOpen(false)}
														className={classNames(
															"/discount-requests" ===
																getLocationAfterLocale(location!)
																? "bg-gold/10 text-gold"
																: "text-gray-700 hover:bg-gold/10 hover:text-gold",
															"group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200",
														)}
													>
														<TagIcon width={24} height={24} />
														{t("discountRequests")}
													</Link>
												</li>
											)}
											{session?.data?.user?.role === "ADMIN" && (
												<li>
													<Link
														href={"/wallets"}
														onClick={() => setSidebarOpen(false)}
														className={classNames(
															"/wallet" === getLocationAfterLocale(location!)
																? "bg-gold/10 text-gold"
																: "text-gray-700 hover:bg-gold/10 hover:text-gold",
															"group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200",
														)}
													>
														<WalletIcon width={24} height={24} />
														{t("balanceRequests")}{" "}
													</Link>
												</li>
											)}
										</ul>
									</li>
								</ul>
							</nav>
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:top-0 lg:z-50 lg:flex lg:flex-col lg:w-full lg:h-20 bg-white shadow-md">
				<div className="flex grow gap-y-5 cursor-default w-full max-w-6xl mx-auto h-full">
					<div className="flex items-center gap-x-2 h-full">
						<Link href="/">
							<Image
								alt="ACPOCO"
								src="https://shop.acpoco.de/cdn/shop/files/beyaz-zemin.png?v=1761649851&width=200"
								width={150}
								height={105}
							/>
						</Link>
					</div>
					<nav className="flex items-center mx-auto">
						<ul role="list" className="flex flex-1 gap-y-7">
							<li>
								<ul role="list" className="flex -mx-2 space-x-2">
									{session?.data?.user?.role === "ADMIN" && (
										<li>
											<Link
												href={"/dashboard"}
												className={classNames(
													"/dashboard" === getLocationAfterLocale(location!)
														? "bg-gold/10 text-gold"
														: "text-gray-600 hover:bg-gold/10 hover:text-gold",
													"group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 transition-all duration-200",
												)}
											>
												{t("dashboard")}
											</Link>
										</li>
									)}
									{navigation.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className={classNames(
													item.href === getLocationAfterLocale(location!)
														? "bg-gold/10 text-gold"
														: "text-gray-600 hover:bg-gold/10 hover:text-gold",
													"group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 transition-all duration-200",
												)}
											>
												<item.icon
													aria-hidden="true"
													className="h-6 w-6 shrink-0"
												/>
												{item.name}
											</Link>
										</li>
									))}
									{session?.data?.user?.role === "ADMIN" && (
										<li>
											<Link
												href={"/discount-requests"}
												className={classNames(
													"/discount-requests" ===
														getLocationAfterLocale(location!)
														? "bg-gold/10 text-gold"
														: "text-gray-600 hover:bg-gold/10 hover:text-gold",
													"group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 transition-all duration-200",
												)}
											>
												<TagIcon width={20} height={20} />
												{t("discountRequests")}
											</Link>
										</li>
									)}
									{session?.data?.user?.role === "ADMIN" && (
										<li>
											<Link
												href={"/wallets"}
												className={classNames(
													"/wallet" === getLocationAfterLocale(location!)
														? "bg-gold/10 text-gold"
														: "text-gray-600 hover:bg-gold/10 hover:text-gold",
													"group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 transition-all duration-200",
												)}
											>
												<WalletIcon width={24} height={24} />
												{t("balanceRequests")}{" "}
											</Link>
										</li>
									)}
								</ul>
							</li>
						</ul>
					</nav>
					{session?.data?.user && (
						<button
							type="button"
							onClick={() => {
								setIsModalOpen(true);
							}}
							className="flex items-center text-sm font-semibold"
						>
							{session?.data?.user.role !== "ADMIN" && (
								<div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-center text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200">
									{tWallet("balance")}: ${wallet?.data?.balance}
								</div>
							)}
						</button>
					)}
					<div className="flex items-center gap-x-3 ml-2">
						<LocaleSwitcher />
						{session?.data?.user ? (
							<button
								type="button"
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-50"
							>
								{isLoggingOut ? (
									<>
										<svg
											className="animate-spin h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										{tCommon("loggingOut")}
									</>
								) : (
									<>
										<ArrowRightStartOnRectangleIcon className="h-4 w-4" />
										{tCommon("logout")}
									</>
								)}
							</button>
						) : (
							<button
								type="button"
								onClick={() => setIsLoginModalOpen(true)}
								className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all duration-200"
							>
								<UserCircleIcon className="h-5 w-5" />
								{tCommon("login")}
							</button>
						)}
					</div>
					<BalanceModal
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
						balance={Number(wallet?.data?.balance)}
					/>
				</div>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gradient-to-r from-gold to-amber-500 px-4 py-4 shadow-lg sm:px-6 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-white lg:hidden hover:bg-white/10 rounded-xl transition-colors"
				>
					<span className="sr-only">{tCommon("openSidebar")}</span>
					<Bars3Icon aria-hidden="true" className="h-6 w-6" />
				</button>
			</div>

			{/* Login Modal */}
			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
				onSwitchToRegister={() => setIsRegisterModalOpen(true)}
			/>

			{/* Register Modal */}
			<RegisterModal
				isOpen={isRegisterModalOpen}
				onClose={() => setIsRegisterModalOpen(false)}
				onSwitchToLogin={() => setIsLoginModalOpen(true)}
			/>
		</div>
	);
}

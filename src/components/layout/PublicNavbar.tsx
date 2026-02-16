"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import {
	ArrowRightStartOnRectangleIcon,
	HeartIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { Loader2, Truck } from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/routing";

import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import LocaleSwitcher from "./LocaleSwitcher";
import ProfileDropdown from "./ProfileDropdown";

const PublicNavbar = () => {
	const session = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
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
									className="-m-2.5 p-2.5"
								>
									<span className="sr-only">{t("closeSidebar")}</span>
									<XMarkIcon
										aria-hidden="true"
										className="h-6 w-6 text-white"
									/>
								</button>
							</div>
						</TransitionChild>
						{/* Sidebar component */}
						<div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white px-6 pb-6 shadow-2xl">
							{/* Header */}
							<div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100">
								<Link
									href="/"
									className="text-2xl font-bold"
									onClick={() => setSidebarOpen(false)}
								>
									<Image
										src="https://cdn.shopify.com/s/files/1/0613/8478/5997/files/acpoco_logo.png?v=1751975004"
										alt="ACPOCO"
										width={80}
										height={60}
									/>
								</Link>
								<LocaleSwitcher />
							</div>

							<nav className="flex flex-1 flex-col">
								<ul className="flex flex-1 flex-col gap-y-4">
									{session?.data ? (
										<>
											<li>
												<Link
													href="/profile"
													onClick={() => setSidebarOpen(false)}
													className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors"
												>
													<UserIcon className="w-5 h-5" />
													{t("profile")}
												</Link>
											</li>
											<li>
												<Link
													href="/favorites"
													onClick={() => setSidebarOpen(false)}
													className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors"
												>
													<HeartIcon className="w-5 h-5" />
													{tNav("favorites")}
												</Link>
											</li>
											<li>
												<Link
													href="/sales"
													onClick={() => setSidebarOpen(false)}
													className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors"
												>
													<Truck className="h-5 w-5" />
													{tNav("supplySystem")}
												</Link>
											</li>
											<li className="mt-auto">
												<button
													type="button"
													onClick={handleLogout}
													disabled={isLoggingOut}
													className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
												>
													{isLoggingOut ? (
														<>
															<Loader2
																className="h-5 w-5 animate-spin"
																aria-hidden
															/>
															{t("loggingOut")}
														</>
													) : (
														<>
															<ArrowRightStartOnRectangleIcon className="w-5 h-5" />
															{t("logout")}
														</>
													)}
												</button>
											</li>
										</>
									) : (
										<li>
											<button
												type="button"
												onClick={() => {
													setSidebarOpen(false);
													setIsLoginModalOpen(true);
												}}
												className="flex items-center gap-3 w-full px-4 py-3 text-white bg-linear-to-r from-gold to-amber-500 rounded-xl shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all"
											>
												<UserIcon className="w-5 h-5" />
												{t("login")}
											</button>
										</li>
									)}
								</ul>
							</nav>
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Desktop navbar — glass bar on same background as content (no visual disconnect) */}
			<div className="hidden lg:block lg:sticky lg:top-0 lg:z-50 lg:shrink-0 lg:w-full lg:pt-3 lg:pb-0.5">
				<div className="h-14 w-full rounded-xl bg-white/75 backdrop-blur-md shadow-sm border border-stone-200/60 flex">
					<div className="flex w-full min-w-0">
						{/* Left: same width as landing sidebar (w-72) for alignment */}
						<div className="flex w-72 shrink-0 items-center pl-4 pr-3 lg:pl-6 lg:pr-4">
							<Link href="/" className="text-2xl font-bold cursor-pointer">
								<Image
									src="https://cdn.shopify.com/s/files/1/0613/8478/5997/files/acpoco_logo.png?v=1751975004"
									alt="ACPOCO"
									width={100}
									height={80}
								/>
							</Link>
						</div>
						{/* Right: nav links — fills rest of page */}
						<div className="flex flex-1 min-w-0 items-center justify-end gap-x-2 pr-4 pl-3 lg:pr-6 lg:pl-4">
							<LocaleSwitcher />
							{session?.data && (
								<Link
									href="/favorites"
									className="text-gray-600 hover:text-gold flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gold/10 transition-all duration-200 group relative cursor-pointer"
								>
									<div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
										<HeartIcon className="w-5 h-5" />
									</div>
									<p className="font-medium">{tNav("favorites")}</p>
								</Link>
							)}
							{!session?.data && (
								<button
									type="button"
									onClick={() => setIsLoginModalOpen(true)}
									className="text-gray-600 hover:text-gold flex items-center mr-4 space-x-2 px-4 py-2 rounded-xl hover:bg-gold/10 transition-all duration-200 group cursor-pointer"
								>
									<div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
										<UserIcon className="w-5 h-5" />
									</div>
									<p className="font-medium">{t("login")}</p>
								</button>
							)}
							{session?.data && <ProfileDropdown />}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile header */}
			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-linear-to-r from-gold to-amber-500 px-5 py-4 shadow-lg sm:px-8 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-white lg:hidden hover:bg-white/10 rounded-xl transition-colors"
				>
					<span className="sr-only">{t("openSidebar")}</span>
					<Bars3Icon aria-hidden="true" className="h-6 w-6" />
				</button>
				<div className="flex-1 flex justify-center">
					<Link href="/">
						<Image
							src="https://cdn.shopify.com/s/files/1/0613/8478/5997/files/acpoco_logo.png?v=1751975004"
							alt="ACPOCO"
							width={70}
							height={50}
							className="brightness-0 invert"
						/>
					</Link>
				</div>
				<div className="w-10" /> {/* Spacer for centering */}
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
};

export default PublicNavbar;

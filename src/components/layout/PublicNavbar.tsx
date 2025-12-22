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
	UserIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Link } from "@/i18n/routing";

import LoginModal from "../auth/LoginModal";
import ProfileDropdown from "./ProfileDropdown";

const PublicNavbar = () => {
	const session = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

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
									<span className="sr-only">Close sidebar</span>
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
							<div className="flex h-16 shrink-0 items-center border-b border-gray-100">
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
													Profil
												</Link>
											</li>
											<li>
												<Link
													href="/sales"
													onClick={() => setSidebarOpen(false)}
													className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors"
												>
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={1.5}
															d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
														/>
													</svg>
													Tedarik Sistemine Giriş
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
															<svg
																className="animate-spin h-5 w-5"
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
															Çıkış yapılıyor...
														</>
													) : (
														<>
															<ArrowRightStartOnRectangleIcon className="w-5 h-5" />
															Çıkış Yap
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
												className="flex items-center gap-3 w-full px-4 py-3 text-white bg-gradient-to-r from-gold to-amber-500 rounded-xl shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all"
											>
												<UserIcon className="w-5 h-5" />
												Giriş Yap
											</button>
										</li>
									)}
								</ul>
							</nav>
						</div>
					</DialogPanel>
				</div>
			</Dialog>

			{/* Static navbar for desktop */}
			<div className="hidden lg:fixed lg:top-0 lg:z-50 lg:flex lg:flex-col lg:w-full lg:h-16 bg-white shadow-md">
				<div className="flex grow gap-y-5 overflow-y-auto cursor-default max-w-6xl mx-auto w-full justify-between">
					<div className="flex shrink-0 items-center gap-x-2">
						<Link href="/" className="text-2xl font-bold">
							<Image
								src="https://cdn.shopify.com/s/files/1/0613/8478/5997/files/acpoco_logo.png?v=1751975004"
								alt="ACPOCO"
								width={100}
								height={80}
							/>
						</Link>
					</div>

					<div className="flex items-center space-x-3">
						{!session?.data && (
							<button
								type="button"
								onClick={() => setIsLoginModalOpen(true)}
								className="text-gray-600 hover:text-gold flex items-center mr-4 space-x-2 px-4 py-2 rounded-xl hover:bg-gold/10 transition-all duration-200 group"
							>
								<div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
									<UserIcon className="w-5 h-5" />
								</div>
								<p className="font-medium">Giriş Yap</p>
							</button>
						)}
						{session?.data && <ProfileDropdown />}
					</div>
				</div>
			</div>

			{/* Mobile header */}
			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gradient-to-r from-gold to-amber-500 px-4 py-4 shadow-lg sm:px-6 lg:hidden">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="-m-2.5 p-2.5 text-white lg:hidden hover:bg-white/10 rounded-xl transition-colors"
				>
					<span className="sr-only">Open sidebar</span>
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
			/>
		</div>
	);
};

export default PublicNavbar;

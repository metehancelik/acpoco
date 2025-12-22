"use client";

import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
} from "@headlessui/react";
import {
	EnvelopeIcon,
	EyeIcon,
	EyeSlashIcon,
	LockClosedIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import type React from "react";
import { Fragment, useState } from "react";

type LoginModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSwitchToRegister?: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({
	isOpen,
	onClose,
	onSwitchToRegister,
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const t = useTranslations("Auth");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
				callbackUrl: "/",
			});

			if (result?.ok) {
				onClose();
				window.location.href = result.url || "/";
			} else {
				setError(t("invalidCredentials"));
			}
		} catch {
			setError(t("errorOccurred"));
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setEmail("");
		setPassword("");
		setError("");
		onClose();
	};

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={handleClose}>
				{/* Backdrop */}
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
				</Transition.Child>

				{/* Modal */}
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-90 translate-y-4"
							enterTo="opacity-100 scale-100 translate-y-0"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100 translate-y-0"
							leaveTo="opacity-0 scale-90 translate-y-4"
						>
							<DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
								{/* Decorative top accent */}
								<div className="h-2 bg-gradient-to-r from-gold via-amber-400 to-gold" />

								{/* Close button */}
								<button
									type="button"
									onClick={handleClose}
									className="absolute right-4 top-6 rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
								>
									<XMarkIcon className="h-5 w-5" />
								</button>

								<div className="px-8 py-10">
									{/* Header */}
									<div className="text-center mb-8">
										<div className="mx-auto w-16 h-16 bg-gradient-to-br from-gold to-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-gold/30">
											<LockClosedIcon className="h-8 w-8 text-white" />
										</div>
										<DialogTitle
											as="h2"
											className="text-2xl font-bold text-gray-900"
										>
											{t("welcomeBack")}
										</DialogTitle>
										<p className="text-gray-500 mt-2 text-sm">
											{t("signInToContinue")}
										</p>
									</div>

									{/* Form */}
									<form onSubmit={handleLogin} className="space-y-5">
										{/* Email field */}
										<div className="space-y-1.5">
											<label
												htmlFor="modal-email"
												className="block text-sm font-medium text-gray-700"
											>
												{t("email")}
											</label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
													<EnvelopeIcon className="h-5 w-5 text-gray-400" />
												</div>
												<input
													id="modal-email"
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
													autoComplete="email"
													placeholder="you@example.com"
													className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-gold transition-all duration-200 text-sm bg-gray-50 focus:bg-white"
												/>
											</div>
										</div>

										{/* Password field */}
										<div className="space-y-1.5">
											<label
												htmlFor="modal-password"
												className="block text-sm font-medium text-gray-700"
											>
												{t("password")}
											</label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
													<LockClosedIcon className="h-5 w-5 text-gray-400" />
												</div>
												<input
													id="modal-password"
													type={showPassword ? "text" : "password"}
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													required
													autoComplete="current-password"
													placeholder="••••••••"
													className="block w-full rounded-xl border-0 py-3 pl-11 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-gold transition-all duration-200 text-sm bg-gray-50 focus:bg-white"
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
												>
													{showPassword ? (
														<EyeSlashIcon className="h-5 w-5" />
													) : (
														<EyeIcon className="h-5 w-5" />
													)}
												</button>
											</div>
										</div>

										{/* Error message */}
										{error && (
											<div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
												<p className="text-sm text-red-600 text-center">
													{error}
												</p>
											</div>
										)}

										{/* Submit button */}
										<button
											type="submit"
											disabled={isLoading}
											className="relative w-full rounded-xl bg-gradient-to-r from-gold to-amber-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
										>
											<span
												className={`flex items-center justify-center gap-2 transition-all duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
											>
												{t("signIn")}
											</span>
											{isLoading && (
												<div className="absolute inset-0 flex items-center justify-center">
													<svg
														className="animate-spin h-5 w-5 text-white"
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
												</div>
											)}
											{/* Hover effect */}
											<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
										</button>
									</form>

									{/* Footer */}
									<div className="mt-6 text-center">
										<p className="text-sm text-gray-500">
											{t("noAccount")}{" "}
											<button
												type="button"
												onClick={() => {
													handleClose();
													onSwitchToRegister?.();
												}}
												className="font-semibold text-gold hover:text-amber-600 transition-colors"
											>
												{t("signUp")}
											</button>
										</p>
									</div>
								</div>
							</DialogPanel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default LoginModal;

import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useTranslations } from "next-intl";
import React from "react";

import AlertNotification from "@/utils/alertNotification";

interface Props {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	balance: number;
}
const BalanceModal: React.FC<Props> = ({
	isModalOpen,
	setIsModalOpen,
	balance,
}) => {
	const [amount, setAmount] = React.useState<number>(0);
	const [loading, setLoading] = React.useState(false);
	const t = useTranslations("Wallet");

	const createDepositRequest = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post("/api/wallet", {
				requestedAmount: amount,
			});
			AlertNotification(t("requestCreated"), "success");
		} catch (error: unknown) {
			console.error(error);
		} finally {
			setIsModalOpen(false);
			setLoading(false);
		}
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(e.currentTarget.value));
	};

	return (
		<Transition show={isModalOpen} as={React.Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => setIsModalOpen(false)}
			>
				<Transition.Child
					as={React.Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={React.Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white py-8 px-6 text-left align-middle shadow-xl transition-all">
								<XCircleIcon
									width={32}
									height={32}
									color="#F55E45"
									className="absolute top-2 right-2 cursor-pointer"
									onClick={() => setIsModalOpen(false)}
								/>
								<DialogTitle
									as="h3"
									className="text-lg font-medium text-start leading-6"
								>
									<div className="border-b-2 border-lightGray">
										<p className="text-[24px] font-bold text-headerPrimary mb-2">
											{t("wallet")}:{" "}
										</p>
										<p className="text-3xl font-bold text-[#059669]">
											${Number(balance).toFixed(2)}
										</p>
									</div>
								</DialogTitle>
								<p className="mt-2">{t("accountInfo")}:</p>
								<p className="text-bold text-danger">{t("transferWarning")}</p>
								<div className="w-full rounded-xl mt-2 p-4 bg-[#e7f3e6] mx-auto">
									<form className="w-full" onSubmit={createDepositRequest}>
										<label htmlFor="amount">{t("amountToSend")}</label>
										<input
											className=" w-full text-sm rounded-md border border-primary py-2 pl-3 text-gray-900"
											type="number"
											name="requestedAmount"
											id="requestedAmount"
											onChange={handleChange}
										/>

										<div className="flex justify-between items-center space-x-2 mt-4">
											<button
												type="submit"
												disabled={loading}
												className="bg-primary text-white rounded-lg font-medium px-4 py-1 w-full hover:bg-secondary"
											>
												{loading ? t("sending") : t("send")}
											</button>
										</div>
									</form>
								</div>
							</DialogPanel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default BalanceModal;

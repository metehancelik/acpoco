"use client";

import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import type { OrderWithPopulatedItems } from "@/lib/shipstation/types";

interface AddNoteModalProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedOrder: OrderWithPopulatedItems & { _id: string };
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
	isModalOpen,
	setIsModalOpen,
	selectedOrder,

	// refetchData,
}) => {
	const t = useTranslations("Orders");
	const session = useSession();
	const queryClient = useQueryClient();
	// const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [note, setNote] = useState("");

	const updateNoteMutation = useMutation({
		mutationFn: async (note: string) => {
			const response = await fetch(`/api/orders/notes/${selectedOrder._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ internalNotes: note }),
			});

			if (!response.ok) {
				throw new Error("Failed to update note");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			toast.success(t("noteUpdated"));
		},
	});

	const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNote(e.target.value);
	};

	const handleAddNote = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await updateNoteMutation.mutateAsync(note);
			setIsModalOpen(false);
			setNote("");
		} catch (error: unknown) {
			console.error(error);
		}
	};
	useEffect(() => {
		setNote(selectedOrder?.internalNotes ?? "");
	}, [selectedOrder]);

	return (
		<Transition show={isModalOpen} as={React.Fragment}>
			<Dialog
				as="div"
				className="relative z-10 "
				onClose={() => setIsModalOpen(false)}
			>
				<TransitionChild
					as={React.Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
				</TransitionChild>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild
							as={React.Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel className="w-full max-w-3xl 3xl:max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<DialogTitle
									as="h3"
									className="text-lg mb-8 font-medium text-center leading-6 text-gray-900"
								>
									{t("orderNote")}
								</DialogTitle>

								<div className="py-8 px-8">
									<textarea
										className="w-full h-40 rounded-lg border border-gray-300 resize-none text-sm px-2"
										value={note}
										disabled={session.data?.user?.role === "ADMIN"}
										placeholder={t("enterOrderNote")}
										onChange={handleNoteChange}
									/>
								</div>
								<div className="flex justify-end px-8 space-x-2">
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={() => setIsModalOpen(false)}
									>
										{t("cancel")}
									</button>
									<button
										type="button"
										disabled={updateNoteMutation.isPending}
										className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={handleAddNote}
									>
										{updateNoteMutation.isPending
											? t("updating")
											: t("confirm")}
									</button>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default AddNoteModal;

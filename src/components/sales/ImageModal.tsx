"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import React from "react";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  imgUrl: string;
}
const ImageModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  imgUrl,
}) => {
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
                      Ürün Fotoğrafı{" "}
                    </p>
                  </div>
                </DialogTitle>
                <div className="flex justify-center items-center mt-4">
                  <Image
                    src={imgUrl}
                    loading="lazy"
                    alt="Ürün Fotoğrafı"
                    className="w-full"
                    width={400}
                    height={400}
                  />
                </div>

                <div className="flex justify-between items-center space-x-2 mt-4">
                  <button
                    className="bg-primary text-white rounded-lg font-medium px-4 py-1 w-full hover:bg-secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageModal;

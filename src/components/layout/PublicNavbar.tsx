"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { Link } from "@/i18n/routing";

import ProfileDropdown from "./ProfileDropdown";

// const navigation = [
//   // { name: "Demo", href: "/demo", icon: PresentationChartBarIcon },
//   { name: "Ürünler", href: "/all-products", icon: GiftIcon },
//   // { name: "Giriş Yap", href: "/login", icon: UserCircleIcon },
// ];

const PublicNavbar = () => {
  const session = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-transparent transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
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
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white px-6 pb-2 shadow-md">
              <div className="flex h-8 shrink-0 items-center">
                <Link href={"/"} className="text-2xl font-bold ml-2">
                  ACPOCO
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Profil
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          href="/cart"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Sepetim
                        </Link>
                      </li> */}
                      {/* <li>
                        <Link
                          href="/favorites"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Favorilerim
                        </Link>
                      </li> */}
                      {/* <li>
                        <Link
                          href="/sample-orders"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Numune Siparişlerim
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          href="/sales"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Tedarik Sistemine Giriş
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/api/auth/signout"
                          className="block px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Çıkış Yap
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:top-0 lg:z-50 lg:flex lg:flex-col lg:w-full lg:h-16 bg-white shadow-md">
        {/* <Banner /> */}
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
              <Link
                href="/login"
                className="text-[#777] hover:text-[#d1aa5c] flex items-center mr-4 space-x-2"
              >
                <UserIcon className="" width={24} height={24} />
                <p>Giriş Yap</p>
              </Link>
            )}
            {session?.data && <ProfileDropdown />}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#D2AA5C] px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-100 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" color="white" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          Dashboard
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;

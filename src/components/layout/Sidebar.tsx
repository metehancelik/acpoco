"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  GiftIcon,
  PresentationChartBarIcon,
  TruckIcon,
  UserCircleIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Link } from "@/i18n/routing";
import { classNames } from "@/utils/classNames";
import httpClient from "@/utils/httpClient";

import BalanceModal from "../sales/BalanceModal";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();
  const location = usePathname();
  const navigation = [
    // { name: "Dashboard", href: "/dashboard", icon: PresentationChartBarIcon },
    {
      name: "Siparişlerim",
      href:
        session?.data?.user.role === "ADMIN"
          ? "/sales?status=waitingProduction"
          : "/sales",
      icon: TruckIcon,
    },
    { name: "Ürünler", href: "/", icon: GiftIcon },
    { name: "Profil", href: "/profile", icon: UserCircleIcon },
  ];
  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => httpClient.get(`/wallet/user-wallet`),
  });

  const getLocationAfterLocale = (locale: string) => {
    const parts = locale.split("/");
    // Return path without locale prefix, e.g. '/profile'

    return `/${parts.slice(2).join("/")}`;
  };

  return (
    <>
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
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 ring-1 pt-4">
                {/* <div className="flex h-16 shrink-0 items-center">
                  
                </div> */}
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  item.href ===
                                    getLocationAfterLocale(location!)
                                    ? "bg-secondary text-primary"
                                    : "text-gray-100 hover:bg-secondary hover:text-primary",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
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
                              className={classNames(
                                "/dashboard" ===
                                  getLocationAfterLocale(location!)
                                  ? "bg-secondary text-primary"
                                  : "text-gray-100 hover:bg-secondary hover:text-primary",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <PresentationChartBarIcon
                                width={24}
                                height={24}
                              />{" "}
                              Dashboard
                            </Link>
                          </li>
                        )}
                        {session?.data?.user?.role === "ADMIN" && (
                          <li>
                            <Link
                              href={"/wallets"}
                              className={classNames(
                                "/wallet" === getLocationAfterLocale(location!)
                                  ? "bg-secondary text-primary"
                                  : "text-gray-100 hover:bg-secondary hover:text-primary",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <WalletIcon width={24} height={24} />
                              Bakiye Talepleri{" "}
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
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow gap-y-5 cursor-default w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-x-2 p-2">
              <Link href="/">
                <Image
                  alt="ACPOCO"
                  src="https://cdn.shopify.com/s/files/1/0613/8478/5997/files/acpoco_logo.png?v=1751975004"
                  width={80}
                  height={80}
                />
              </Link>
              {/* <p className="font-bold text-lg text-white">S.A.G.E</p> */}
              {/* <p className="text-sm text-gray-300">
                Sellers&apos; Artisan Growth Engine
              </p> */}
            </div>
            <nav className="flex items-center mx-auto">
              <ul role="list" className="flex flex-1 gap-y-7">
                <li>
                  <ul role="list" className="flex -mx-2 space-x-4">
                    {session?.data?.user?.role === "ADMIN" && (
                      <li>
                        <Link
                          href={"/dashboard"}
                          className={classNames(
                            "/dashboard" === getLocationAfterLocale(location!)
                              ? "bg-secondary text-primary"
                              : "text-gray-600 hover:bg-secondary hover:text-primary",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    {session?.data?.user?.role === "ADMIN" && (
                      <li>
                        <Link
                          href={"/my-products"}
                          className={classNames(
                            "/my-products" === getLocationAfterLocale(location!)
                              ? "bg-secondary text-primary"
                              : "text-gray-600 hover:bg-secondary hover:text-primary",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          Ürünlerim
                        </Link>
                      </li>
                    )}
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {/* TODO: BURAYA DA YUKARIDAKİ KISIMDA BULUNAN CONDITION EKLENECEK */}
                        <Link
                          href={item.href}
                          className={classNames(
                            item.href === getLocationAfterLocale(location!)
                              ? "bg-secondary text-primary"
                              : "text-gray-600 hover:bg-secondary hover:text-primary",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
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
                          href={"/wallets"}
                          className={classNames(
                            "/wallet" === getLocationAfterLocale(location!)
                              ? "bg-secondary text-primary"
                              : "text-gray-600 hover:bg-secondary hover:text-primary",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <WalletIcon width={24} height={24} />
                          Bakiye Talepleri{" "}
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              </ul>
            </nav>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="block text-sm font-semibold text-white "
            >
              {session?.data?.user.role !== "ADMIN" && (
                <p className="rounded-md bg-sageBlue px-3 py-2 text-center shadow-sm hover:bg-indigo-500 ">
                  Bakiye: ${wallet?.data?.balance}
                </p>
              )}
            </button>
            <div className="flex items-center gap-x-2 ml-2">
              <a
                href="/api/auth/signout"
                className="block bg-danger rounded-md px-4 py-2 text-left text-sm text-white data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              >
                Çıkış Yap
              </a>
            </div>
            <BalanceModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              balance={Number(wallet?.data?.balance)}
            />
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-100 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" color="white" />
          </button>
          {/* <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div> */}
        </div>
      </div>
    </>
  );
}

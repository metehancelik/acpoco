import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const ProfileDropdown = () => {
	return (
		<Menu as="div" className="inline-block text-left">
			<div>
				<MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-[#777] shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gold ">
					Hesabım
					<ChevronDownIcon
						aria-hidden="true"
						className="-mr-1 size-5 text-gray-400"
					/>
				</MenuButton>
			</div>

			<MenuItems
				transition
				className="absolute right-100 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
			>
				<div className="py-1">
					<MenuItem>
						<Link
							href="/profile"
							className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
						>
							Profil
						</Link>
					</MenuItem>
					{/* <MenuItem>
            <Link
              href="/favorites"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Favorilerim
            </Link>
          </MenuItem> */}
					{/* <MenuItem>
            <Link
              href="/sample-orders"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Numune Siparişlerim
            </Link>
          </MenuItem> */}
					<MenuItem>
						<Link
							href="/sales"
							className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
						>
							Tedarik Sistemine Giriş
						</Link>
					</MenuItem>

					<form action="#" method="POST">
						<MenuItem>
							<Link
								href="/api/auth/signout"
								className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
							>
								Çıkış Yap
							</Link>
						</MenuItem>
					</form>
				</div>
			</MenuItems>
		</Menu>
	);
};

export default ProfileDropdown;

import { Facebook, Instagram } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
	return (
		<div className="bg-gray-800 text-white py-12">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">Üyelik</h1>
						<Link href={"/register"}>Üye Ol</Link>
						<Link href={"/login"}>Giriş Yap</Link>
						<Link href={"/profile"}>Profil</Link>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">Kısayollar</h1>
						<Link
							target="_blank"
							href={"https://www.angoragumus.com/hakkimizda"}
						>
							Hakkımızda
						</Link>
						<Link href={"/"}>Tüm Ürünler</Link>
						<Link href={"https://www.angoragumus.com/iletisim"}>İletişim</Link>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">Kullanım Koşulları</h1>
						<Link href={"/mesafeli-satis-sozlesmesi"}>
							Mesafeli Satış Sözleşmesi
						</Link>
						<Link href={"/gizlilik-sozlesmesi"}>Gizlilik Sözleşmesi</Link>
						<Link href={"/teslimat-iade-sartlari"}>
							Teslimat ve İade Şartları
						</Link>
					</div>
					<div>
						<div className="flex gap-4">
							<Link
								href={"https://www.facebook.com/angoragumus"}
								target="_blank"
							>
								<Facebook color="white" size={32} />
							</Link>
							<Link
								href={"https://www.instagram.com/angoragumus"}
								target="_blank"
							>
								<Instagram color="white" size={32} />
							</Link>
						</div>
						<div className="mt-8 mx-auto">
							<Image
								src={"/images/logo_band_white@1X.png"}
								alt="logo"
								className="mx-auto"
								width={400}
								height={100}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;

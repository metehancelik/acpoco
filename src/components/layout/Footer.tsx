"use client";

import { Facebook, Instagram } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
	const t = useTranslations("Footer");
	const tCommon = useTranslations("Common");
	const tNav = useTranslations("Navigation");

	return (
		<div className="bg-gray-800 text-white py-12">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">{t("membership")}</h1>
						<Link href={"/register"}>{tCommon("register")}</Link>
						<Link href={"/login"}>{tCommon("login")}</Link>
						<Link href={"/profile"}>{tCommon("profile")}</Link>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">{t("shortcuts")}</h1>
						<Link
							target="_blank"
							href={"https://www.angoragumus.com/hakkimizda"}
						>
							{t("aboutUs")}
						</Link>
						<Link href={"/"}>{tNav("allProducts")}</Link>
						<Link href={"https://www.angoragumus.com/iletisim"}>
							{t("contact")}
						</Link>
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="text-lg font-bold">{t("termsOfUse")}</h1>
						<Link href={"/mesafeli-satis-sozlesmesi"}>
							{t("distanceSalesContract")}
						</Link>
						<Link href={"/gizlilik-sozlesmesi"}>{t("privacyPolicy")}</Link>
						<Link href={"/teslimat-iade-sartlari"}>
							{t("deliveryAndReturn")}
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

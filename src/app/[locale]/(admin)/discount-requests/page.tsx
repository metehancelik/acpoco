import { setRequestLocale } from "next-intl/server";

import DiscountRequestsTable from "@/components/dashboard/DiscountRequestsTable";

type Props = {
	params: { locale: string };
};

const DiscountRequestsPage = async ({ params: { locale } }: Props) => {
	setRequestLocale(locale);

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
					İndirim Talepleri
				</h1>
				<p className="text-sm text-gray-500">
					Kullanıcılardan gelen indirim taleplerini görüntüleyin ve yönetin.
				</p>
			</div>

			<DiscountRequestsTable />
		</div>
	);
};

export default DiscountRequestsPage;

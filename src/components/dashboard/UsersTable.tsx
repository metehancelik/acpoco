"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import httpClient from "@/utils/httpClient";

import Loading from "../shared/Loading";
import Pagination from "../shared/Pagination";

interface IUser {
	_id: string;
	name: string;
	surname: string;
	email: string;
	role: string;
	balance: number;
	stores: { storeName: string }[];
}

const UsersTable = () => {
	const t = useTranslations("Dashboard");
	const searchParams = useSearchParams();
	const page = searchParams?.get("page") || "1";

	const {
		data: users,
		isLoading,
		error,
	} = useQuery<IUser[]>({
		queryKey: ["users", page],
		queryFn: async () => {
			const response = await httpClient.get(`users?page=${page}`);
			return response.data;
		},
	});

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		toast.error(t("usersLoadError"));
		return null;
	}

	return (
		<div className="text-sm w-full">
			<div className="overflow-x-auto">
				<div className="max-h-[45vh] overflow-y-auto">
					<table className="min-w-full">
						<thead className="bg-slate-50/80 sticky top-0 z-10">
							<tr>
								<th
									scope="col"
									className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("firstName")}
								</th>
								<th
									scope="col"
									className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("lastName")}
								</th>
								<th
									scope="col"
									className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("email")}
								</th>
								<th
									scope="col"
									className="px-3 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("storeName")}
								</th>
								<th
									scope="col"
									className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("balance")}
								</th>
								<th
									scope="col"
									className="py-4 pl-3 pr-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									{t("detail")}
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{users?.map((user) => (
								<tr
									key={user.email}
									className="hover:bg-slate-50/50 transition-colors"
								>
									<td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
										{user.name}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
										{user.surname}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
										{user.email}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
										{user.stores.map((store) => (
											<span
												key={store.storeName}
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-1"
											>
												{store.storeName}
											</span>
										))}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-center text-sm">
										<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700">
											{user.balance > 0 && "€"}
											{user.balance.toLocaleString()}
										</span>
									</td>
									<td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-center text-sm font-medium">
										<Link
											href={`/users/${user._id}`}
											className="inline-flex items-center gap-1.5 bg-sage-blue hover:bg-sage-blue/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
										>
											{t("detail")}
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="p-4 border-t bg-slate-50/50">
				<Pagination totalPages={1} />
			</div>
		</div>
	);
};

export default UsersTable;

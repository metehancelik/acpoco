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
		<div className="rounded-md bg-gray-50 p-5 text-sm w-full">
			<h2 className="text-2xl font-bold mb-4">{t("users")}</h2>
			<div className="flow-root ">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-[40vh] overflow-y-auto relative">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
									>
										{t("firstName")}
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										{t("lastName")}
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										{t("email")}
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										{t("storeName")}
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-3 pr-4 sm:pr-0 text-center"
									>
										{t("balance")}
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-3 pr-4 sm:pr-0 text-center"
									>
										{t("detail")}
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{users?.map((user) => (
									<tr key={user.email}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
											{user.name}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{user.surname}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{user.email}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
											{user.stores.map((store) => (
												<p key={store.storeName}>{store.storeName}</p>
											))}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
											{user.balance > 0 && "€"}
											{user.balance}
										</td>
										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
											<Link
												href={`/users/${user._id}`}
												className="bg-sage-blue hover:bg-indigo-400 text-center py-2 px-4 rounded-md text-white"
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
			</div>
			{/* FIXME: Implement pagination */}
			<Pagination totalPages={1} />
		</div>
	);
};

export default UsersTable;

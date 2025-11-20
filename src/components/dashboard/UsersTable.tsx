"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Pagination from "../shared/Pagination";

interface IUser {
	_id: string;
	name: string;
	surname: string;
	email: string;
	role: string;
	balance: number;
	stores: { storeName: string }[];
	discountPercent?: number;
}

const UsersTable = () => {
	const [users, setUsers] = useState<IUser[] | null>([]);
	const searchParams = useSearchParams();
	const getUsers = async () => {
		try {
			const res = await axios.get(
				`/api/users?page=${searchParams?.get("page") || 1}`,
			);
			setUsers(res.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};
	useEffect(() => {
		getUsers();
	}, [getUsers]);

	return (
		<div className="rounded-md bg-gray-50 p-5 text-sm w-full">
			<h2 className="text-2xl font-bold mb-4">Kullanıcılar</h2>
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
										İsim
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Soyisim
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Email
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>
										Mağaza Adı
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-3 pr-4 sm:pr-0"
									>
										Bakiye
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-3 pr-4 sm:pr-0"
									>
										İndirim (%)
									</th>
									<th
										scope="col"
										className="sticky bg-gray-50 top-0 py-3.5 pl-3 pr-4 sm:pr-0"
									>
										Detay
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
											{user.balance}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
											<div className="flex items-center gap-2 justify-center">
												<input
													type="number"
													defaultValue={user.discountPercent || 0}
													min={0}
													max={100}
													className="w-20 border rounded px-2 py-1 text-center"
													onBlur={async (e) => {
														const value = Number(e.target.value || 0);
														const normalized = Math.max(
															0,
															Math.min(100, value),
														);
														if (normalized !== (user.discountPercent || 0)) {
															await axios.put(
																`/api/users/${user._id}/discount`,
																{
																	discountPercent: normalized,
																},
															);
															getUsers();
														}
													}}
												/>
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
													%{user.discountPercent || 0}
												</span>
											</div>
										</td>

										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
											<Link
												href={`/users/${user._id}`}
												className="bg-sage-blue hover:bg-indigo-400 text-center py-2 px-4 rounded-md text-white"
											>
												Detay
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

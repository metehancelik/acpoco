"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
	totalPages: number;
	variant?: "light" | "dark";
};

const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	variant = "light",
}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const currentPage = Math.min(
		Math.max(1, Number.parseInt(searchParams?.get("page") || "1", 10)),
		totalPages || 1,
	);

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams?.toString());
		params.set("page", page.toString());
		router.push(`${window.location.pathname}?${params.toString()}`);
	};

	if (!totalPages || totalPages <= 1) return null;

	const isDark = variant === "dark";

	return (
		<div className="flex items-center justify-center gap-1">
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-all ${
					isDark
						? "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-600/50 disabled:hover:text-slate-300"
						: "bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-slate-200 disabled:hover:text-slate-700"
				}`}
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<div className="flex items-center gap-1.5 px-3 py-1">
				<span
					className={`text-sm font-bold ${
						isDark ? "text-white" : "text-gray-900"
					}`}
				>
					{currentPage}
				</span>
				<span
					className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
				>
					/
				</span>
				<span
					className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
				>
					{totalPages}
				</span>
			</div>

			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-all ${
					isDark
						? "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-600/50 disabled:hover:text-slate-300"
						: "bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-slate-200 disabled:hover:text-slate-700"
				}`}
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	);
};

export default Pagination;

"use client";

import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface PaginationProps {
	totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const t = useTranslations("Common");
	const currentPage = Math.min(
		Math.max(1, parseInt(searchParams?.get("page") || "1", 10)),
		totalPages,
	);

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams?.toString());
		params.set("page", page.toString());
		router.push(`${window.location.pathname}?${params.toString()}`);
	};

	return (
		<nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
			<div className="-mt-px flex w-0 flex-1">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
				>
					<ArrowLongLeftIcon
						aria-hidden="true"
						className="mr-3 h-5 w-5 text-gray-400"
					/>
					{t("previous")}
				</button>
			</div>
			<div className="hidden md:-mt-px md:flex">
				<p>
					{" "}
					{currentPage}/{totalPages}
				</p>
				{/* {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                page === currentPage
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          ),
        )} */}
			</div>
			<div className="-mt-px flex w-0 flex-1 justify-end">
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50"
				>
					{t("next")}
					<ArrowLongRightIcon
						aria-hidden="true"
						className="ml-3 h-5 w-5 text-gray-400"
					/>
				</button>
			</div>
		</nav>
	);
};

export default Pagination;

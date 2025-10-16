"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface CursorPaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
  currentQuery?: string;
  currentCategory?: string;
  currentPage?: number;
}

const CursorPagination = ({
  hasNextPage,
  hasPreviousPage,
  nextCursor,
  previousCursor,
  currentQuery,
  currentCategory,
  currentPage = 1,
}: CursorPaginationProps) => {
  const router = useRouter();

  const buildUrl = (cursor?: string, page?: number, before?: string) => {
    const params = new URLSearchParams();

    // Preserve existing search parameters
    if (currentQuery) {
      params.set("query", currentQuery);
    }
    if (currentCategory) {
      params.set("category", currentCategory);
    }

    // Manage page number explicitly
    if (page && page > 1) {
      params.set("page", String(page));
    }

    // Clear conflicting params first
    params.delete("before");
    params.delete("cursor");

    // Add cursor/before if provided
    if (before) {
      params.set("before", before);
    } else if (cursor) {
      params.set("cursor", cursor);
    }

    return `?${params.toString()}`;
  };

  const goToNext = () => {
    if (hasNextPage && nextCursor) {
      router.push(buildUrl(nextCursor, currentPage + 1));
    }
  };

  const goToPrevious = () => {
    if (hasPreviousPage) {
      router.push(
        buildUrl(undefined, Math.max(1, currentPage - 1), previousCursor),
      );
    }
  };

  const goToFirst = () => {
    router.push(buildUrl(undefined, 1));
  };

  // Don't render if no pagination is needed
  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile pagination */}
        <button
          onClick={goToPrevious}
          disabled={!hasPreviousPage}
          className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            hasPreviousPage
              ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          onClick={goToNext}
          disabled={!hasNextPage}
          className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            hasNextPage
              ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing products from your catalog
            {currentQuery && (
              <span className="font-medium"> matching {currentQuery}</span>
            )}
            {currentCategory && (
              <span className="font-medium">
                {" "}
                in category {currentCategory}
              </span>
            )}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* First/Home button */}
            <button
              onClick={goToFirst}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">First page</span>
              <span className="text-sm font-medium">Başa Dön</span>
            </button>

            {/* Previous button */}
            <button
              onClick={goToPrevious}
              disabled={!hasPreviousPage}
              className={`relative inline-flex items-center px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                hasPreviousPage
                  ? "text-gray-400 hover:bg-gray-50"
                  : "text-gray-200 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Current page indicator */}
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
              {currentPage}
            </span>

            {/* Next button */}
            <button
              onClick={goToNext}
              disabled={!hasNextPage}
              className={`relative inline-flex items-center px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                hasNextPage
                  ? "text-gray-400 hover:bg-gray-50"
                  : "text-gray-200 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* More indicator */}
            {hasNextPage && (
              <span className="relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                ...
              </span>
            )}

            {!hasNextPage && (
              <span className="relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300">
                End
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CursorPagination;

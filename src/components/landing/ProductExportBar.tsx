"use client";

import {
	CheckCheck,
	CheckSquare,
	FileDown,
	Loader2,
	Square,
	X,
} from "lucide-react";
import { useCallback, useState } from "react";

import { useProductSelectionStore } from "@/store/productSelectionStore";

type Props = {
	/** IDs of products currently loaded in the grid */
	loadedIds: string[];
	/** Current active category filter (null = all) */
	category: string | null;
	/** Current active search query */
	query: string | null;
};

export default function ProductExportBar({
	loadedIds,
	category,
	query,
}: Props) {
	const { selectedIds, selectMany, deselectMany, clearAll } =
		useProductSelectionStore();
	const [isExporting, setIsExporting] = useState(false);
	const [isSelectingAll, setIsSelectingAll] = useState(false);

	const selectedCount = selectedIds.size;
	const loadedCount = loadedIds.length;
	const allLoadedSelected =
		loadedCount > 0 && loadedIds.every((id) => selectedIds.has(id));

	// Toggle selection of all currently loaded products
	const handleToggleLoaded = useCallback(() => {
		if (allLoadedSelected) {
			deselectMany(loadedIds);
		} else {
			selectMany(loadedIds);
		}
	}, [allLoadedSelected, loadedIds, selectMany, deselectMany]);

	// Fetch ALL product IDs from server and select them
	const handleSelectAll = useCallback(async () => {
		setIsSelectingAll(true);
		try {
			const params = new URLSearchParams();
			if (category) params.set("category", category);
			if (query?.trim()) params.set("query", query.trim());
			const res = await fetch(`/api/products/ids?${params.toString()}`);
			if (!res.ok) throw new Error("Failed to fetch product IDs");
			const data = await res.json();
			selectMany(data.ids as string[]);
		} catch (err) {
			console.error("Select all failed:", err);
		} finally {
			setIsSelectingAll(false);
		}
	}, [category, query, selectMany]);

	// Export selected products as PDF
	const handleExport = useCallback(async () => {
		if (selectedCount === 0) return;
		setIsExporting(true);
		try {
			const res = await fetch("/api/products/pdf", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productIds: Array.from(selectedIds) }),
			});
			if (!res.ok) throw new Error("PDF generation failed");

			// Trigger browser download
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `urun-katalogu-${Date.now()}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Export failed:", err);
		} finally {
			setIsExporting(false);
		}
	}, [selectedIds, selectedCount]);

	return (
		<div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
			{/* Selection toggles */}
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={handleToggleLoaded}
					className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
				>
					{allLoadedSelected ? (
						<CheckSquare className="h-3.5 w-3.5 text-amber-600" />
					) : (
						<Square className="h-3.5 w-3.5" />
					)}
					{allLoadedSelected ? "Yüklenenleri kaldır" : "Yüklenenleri seç"}
				</button>

				<button
					type="button"
					onClick={handleSelectAll}
					disabled={isSelectingAll}
					className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-60"
				>
					{isSelectingAll ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<CheckCheck className="h-3.5 w-3.5" />
					)}
					Tümünü seç
				</button>
			</div>

			{/* Divider */}
			<div className="h-5 w-px bg-stone-200" />

			{/* Selection count badge */}
			<span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
				{selectedCount} ürün seçili
			</span>

			{/* Clear */}
			{selectedCount > 0 && (
				<button
					type="button"
					onClick={clearAll}
					className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
				>
					<X className="h-3.5 w-3.5" />
					Temizle
				</button>
			)}

			{/* Spacer */}
			<div className="flex-1" />

			{/* Export button */}
			<button
				type="button"
				onClick={handleExport}
				disabled={selectedCount === 0 || isExporting}
				className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isExporting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>PDF oluşturuluyor…</span>
					</>
				) : (
					<>
						<FileDown className="h-4 w-4" />
						<span>PDF olarak dışa aktar</span>
					</>
				)}
			</button>
		</div>
	);
}

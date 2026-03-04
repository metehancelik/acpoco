"use client";

import { create } from "zustand";

type ProductSelectionState = {
	selectedIds: Set<string>;
	toggle: (id: string) => void;
	selectMany: (ids: string[]) => void;
	deselectMany: (ids: string[]) => void;
	clearAll: () => void;
	isSelected: (id: string) => boolean;
};

export const useProductSelectionStore = create<ProductSelectionState>(
	(set, get) => ({
		selectedIds: new Set(),

		toggle: (id) =>
			set((state) => {
				const next = new Set(state.selectedIds);
				if (next.has(id)) {
					next.delete(id);
				} else {
					next.add(id);
				}
				return { selectedIds: next };
			}),

		selectMany: (ids) =>
			set((state) => {
				const next = new Set(state.selectedIds);
				for (const id of ids) next.add(id);
				return { selectedIds: next };
			}),

		deselectMany: (ids) =>
			set((state) => {
				const next = new Set(state.selectedIds);
				for (const id of ids) next.delete(id);
				return { selectedIds: next };
			}),

		clearAll: () => set({ selectedIds: new Set() }),

		isSelected: (id) => get().selectedIds.has(id),
	}),
);

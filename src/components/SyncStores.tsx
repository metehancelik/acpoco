"use client";

export const SyncButton = () => {
	const handleSyncStores = async () => {
		const response = await fetch("/api/stores/syncstores");
		await response.json();
	};

	return (
		<button
			className="bg-blue-500 text-white px-4 py-2 rounded-md"
			onClick={handleSyncStores}
		>
			Sync Stores
		</button>
	);
};

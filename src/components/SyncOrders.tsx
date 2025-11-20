"use client";

import { useState } from "react";

interface SyncResult {
	orderId: string;
	success: boolean;
	error?: string;
}

interface SyncResponse {
	success: boolean;
	message: string;
	summary?: {
		total: number;
		successful: number;
		failed: number;
	};
	results?: SyncResult[];
	error?: string;
}

export default function OrderDeskSync() {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<SyncResponse | null>(null);

	const handleSync = async () => {
		try {
			setIsLoading(true);
			setResult(null);

			const response = await fetch("/api/orders/sync", {
				method: "GET",
			});

			const data: SyncResponse = await response.json();
			setResult(data);
		} catch (error) {
			setResult({
				success: false,
				message: "Failed to sync orders",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<button
				onClick={handleSync}
				disabled={isLoading}
				className={`px-4 py-2 rounded-md ${
					isLoading
						? "bg-gray-400 cursor-not-allowed"
						: "bg-blue-500 hover:bg-blue-600"
				} text-white font-semibold`}
			>
				{isLoading ? "Syncing..." : "Sync Orders"}
			</button>

			{result && (
				<div
					className={`p-4 rounded-md ${
						result.success ? "bg-green-50" : "bg-red-50"
					}`}
				>
					<h3 className="font-semibold mb-2">
						{result.success ? "Sync Completed" : "Sync Failed"}
					</h3>
					<p className="text-sm mb-2">{result.message}</p>

					{result.summary && (
						<div className="text-sm space-y-1">
							<p>Total Orders: {result.summary.total}</p>
							<p className="text-green-600">
								Successful: {result.summary.successful}
							</p>
							<p className="text-red-600">Failed: {result.summary.failed}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

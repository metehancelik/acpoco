"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ProcessResult = {
	totalOrders: number;
	processedCount: number;
	errorCount: number;
};

export default function ProcessAmazonCustomizations() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [result, setResult] = useState<ProcessResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleProcess = async () => {
		setIsProcessing(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch("/api/process-amazon-customizations", {
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.details || data.error || "Processing failed");
			}

			setResult(data.result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">
				Amazon Customizations Processor
			</h2>

			<p className="text-sm text-gray-600 mb-4">
				This tool processes all Amazon orders with CustomizedURL and extracts
				customization data. It will:
			</p>

			<ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
				<li>Find all orders with Amazon customization URLs</li>
				<li>Download and extract customization data from zip files</li>
				<li>Parse customization options and save to database</li>
				<li>Update existing orders with processed data</li>
			</ul>

			<Button onClick={handleProcess} disabled={isProcessing}>
				{isProcessing ? "Processing..." : "Process All Amazon Customizations"}
			</Button>

			{error && (
				<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-800 font-semibold">Error:</p>
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			{result && (
				<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
					<p className="text-sm text-green-800 font-semibold mb-2">
						Processing Complete!
					</p>
					<div className="text-sm text-green-700 space-y-1">
						<p>Total orders found: {result.totalOrders}</p>
						<p>Items successfully processed: {result.processedCount}</p>
						<p>Items with errors: {result.errorCount}</p>
					</div>
				</div>
			)}
		</Card>
	);
}

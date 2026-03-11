"use client";

import { useEffect } from "react";

import { logError } from "@/lib/log-error";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		logError(error, { digest: error.digest });
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
						gap: "1rem",
						fontFamily: "system-ui, sans-serif",
					}}
				>
					<h2>Something went wrong</h2>
					<button
						onClick={reset}
						style={{
							padding: "0.5rem 1rem",
							cursor: "pointer",
						}}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}

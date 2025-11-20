"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
	ssr: false,
	loading: () => <p>Loading API Documentation...</p>,
});

export default function ApiDocs() {
	return (
		<div className="container mx-auto p-4">
			<SwaggerUI url="/api/docs/json" />
		</div>
	);
}

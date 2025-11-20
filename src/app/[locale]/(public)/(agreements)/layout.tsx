import type React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen container mx-auto mt-12">
			{children}
		</div>
	);
}

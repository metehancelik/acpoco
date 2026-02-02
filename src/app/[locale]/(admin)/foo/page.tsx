"use client";

import Image from "next/image";
import { useState } from "react";

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files?.[0] || null);
	};
	const uploadFile = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		const res = await fetch("/api/image", {
			method: "POST",
			body: formData,
		});
		const data = (await res.json()) as { imageUrl?: string };
		if (data.imageUrl) setImageUrl(data.imageUrl);
	};

	return (
		<div className="App">
			<div>
				<input type="file" onChange={handleFileChange} />
				<button onClick={uploadFile}>Upload</button>
			</div>
			<div>
				{imageUrl ? (
					<Image src={imageUrl} alt="uploaded" width={160} height={160} />
				) : null}
			</div>
		</div>
	);
}

export default App;

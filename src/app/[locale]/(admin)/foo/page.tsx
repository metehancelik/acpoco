"use client";
import Image from "next/image";
import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };
  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/image", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
      </div>
      <div>
        <Image
          src="https://sage-app-bucket.s3.eu-north-1.amazonaws.com/pasta.jpg"
          alt="pasta"
          key="pasta"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}

export default App;

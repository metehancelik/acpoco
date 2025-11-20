import axios from "axios";
import JSZip from "jszip";

export interface AmazonCustomizationData {
	customizationData: Record<string, unknown>;
	rawJson: string;
}

export async function fetchAmazonCustomizationData(
	customizedUrl: string,
): Promise<AmazonCustomizationData | null> {
	try {
		// Zip dosyasını indir
		const response = await axios.get(customizedUrl, {
			responseType: "arraybuffer",
			timeout: 30000, // 30 saniye timeout
		});

		// JSZip ile zip dosyasını aç
		const zip = new JSZip();
		const zipContent = await zip.loadAsync(response.data);

		// Zip içindeki dosyaları listele
		const fileNames = Object.keys(zipContent.files);

		// JSON dosyasını bul (genellikle tek dosya var)
		const jsonFile =
			fileNames.find((name) => name.endsWith(".json")) || fileNames[0];

		if (!jsonFile) {
			console.error("No JSON file found in the zip");

			return null;
		}

		// JSON dosyasını oku
		const jsonContent = await zipContent.file(jsonFile)?.async("string");

		if (!jsonContent) {
			console.error("Could not read JSON content from zip");

			return null;
		}

		// JSON'u parse et
		const customizationData = JSON.parse(jsonContent);

		return {
			customizationData,
			rawJson: jsonContent,
		};
	} catch (error) {
		console.error("Error fetching Amazon customization data:", error);

		return null;
	}
}

export function isAmazonCustomizationUrl(url: string): boolean {
	return url.includes("amazon.com") && url.includes("CustomizedURL");
}

export function extractCustomizationUrlFromOptions(
	options: Array<{ name: string; value: string }>,
): string | null {
	const customizationOption = options.find(
		(option) => option.name === "CustomizedURL",
	);

	return customizationOption?.value || null;
}

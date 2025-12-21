import axios from "axios";
import JSZip from "jszip";

export type AmazonCustomizationData = {
	customizationData: Record<string, unknown>;
	rawJson: string;
};

export type AmazonCustomizationOption = {
	label: string;
	option: string;
	priceDelta: number;
	unit?: string;
};

type AmazonOption = { name?: string; value?: string } | null | undefined;

function normalizeCustomizationUrl(raw: string): string {
	const trimmed = raw.trim();
	if (!trimmed) return trimmed;

	// If the value contains a query param like CustomizedURL=... extract and decode it.
	try {
		const url = new URL(trimmed);
		const candidates = [
			url.searchParams.get("CustomizedURL"),
			url.searchParams.get("customizedUrl"),
			url.searchParams.get("customizedURL"),
			url.searchParams.get("customizationUrl"),
			url.searchParams.get("customizationURL"),
		].filter(Boolean) as string[];
		if (candidates.length) return decodeURIComponent(candidates[0]);
	} catch {
		// ignore
	}

	// Fallback: string contains CustomizedURL=... but is not a valid URL
	const match = trimmed.match(
		/(?:CustomizedURL|customizedUrl|customizationUrl)=([^&\s]+)/,
	);
	if (match?.[1]) {
		try {
			return decodeURIComponent(match[1]);
		} catch {
			return match[1];
		}
	}

	return trimmed;
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
	const u = url.toLowerCase();
	return u.includes("amazon.") && u.includes("customized");
}

export function extractCustomizationUrlFromOptions(
	options: Array<{ name: string; value: string }>,
): string | null {
	const found = (options as AmazonOption[]).find((option) => {
		const name = option?.name?.toLowerCase();
		return Boolean(name?.includes("customized"));
	});

	const raw = found?.value;
	if (!raw) return null;
	return normalizeCustomizationUrl(raw);
}

function extractAmazonCustomizationOptionsFromData(
	customizationData: Record<string, unknown>,
): AmazonCustomizationOption[] {
	const options: AmazonCustomizationOption[] = [];

	const v3 = customizationData["version3.0"] as
		| {
				customizationInfo?: {
					surfaces?: Array<{
						areas?: Array<{
							label?: string;
							name?: string;
							optionValue?: string;
							text?: string;
							unit?: string;
							priceDelta?: number | { value?: number };
						}>;
					}>;
				};
		  }
		| undefined;

	const surfaces = v3?.customizationInfo?.surfaces;
	if (!surfaces) return options;

	for (const surface of surfaces) {
		if (!surface.areas) continue;
		for (const area of surface.areas) {
			const priceDelta =
				typeof area.priceDelta === "number"
					? area.priceDelta
					: (area.priceDelta?.value ?? 0);
			options.push({
				label: area.label || area.name || "",
				option: area.optionValue || area.text || "",
				priceDelta,
				unit: area.unit || undefined,
			});
		}
	}

	return options;
}

export async function getAmazonCustomizationFromOptions(
	options: Array<{ name: string; value: string }>,
): Promise<{
	amazonCustomizationData: Record<string, unknown> | null;
	amazonCustomizationOptions?: AmazonCustomizationOption[];
	customizationUrl: string | null;
}> {
	const customizationUrl = extractCustomizationUrlFromOptions(options);
	if (!customizationUrl) {
		return {
			amazonCustomizationData: null,
			amazonCustomizationOptions: undefined,
			customizationUrl: null,
		};
	}

	if (!/^https?:\/\//i.test(customizationUrl)) {
		return {
			amazonCustomizationData: null,
			amazonCustomizationOptions: undefined,
			customizationUrl,
		};
	}

	// Do not gate on hostname; some accounts return signed URLs that don't contain "amazon.com".
	const customization = await fetchAmazonCustomizationData(customizationUrl);
	const customizationData = customization?.customizationData;
	if (!customizationData) {
		return {
			amazonCustomizationData: null,
			amazonCustomizationOptions: undefined,
			customizationUrl,
		};
	}

	const amazonCustomizationOptions =
		extractAmazonCustomizationOptionsFromData(customizationData);

	return {
		amazonCustomizationData: customizationData,
		amazonCustomizationOptions: amazonCustomizationOptions.length
			? amazonCustomizationOptions
			: undefined,
		customizationUrl,
	};
}

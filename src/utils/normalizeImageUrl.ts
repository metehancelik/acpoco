export const normalizeImageSrc = (raw: string): string => {
	if (!raw) return "";
	const stripped = raw.trim().replace(/^[\s["]+|[\s\]"]+$/g, "");
	const driveFileMatch = stripped.match(
		/https?:\/\/drive\.google\.com\/file\/d\/([^/?\s]+)(?:\/|$|\?)/,
	);
	if (driveFileMatch) {
		return `https://drive.google.com/uc?id=${driveFileMatch[1]}`;
	}
	const driveOpenMatch = stripped.match(
		/https?:\/\/drive\.google\.com\/open\?id=([^&\s]+)/,
	);
	if (driveOpenMatch) {
		return `https://drive.google.com/uc?id=${driveOpenMatch[1]}`;
	}
	return stripped;
};

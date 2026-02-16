/** Default width for Drive thumbnail (Google's thumbnail API works better than /uc in img tags). */
const DRIVE_THUMBNAIL_WIDTH = 800;

function getDriveFileId(url: string): string | null {
	const stripped = url.trim().replace(/^[\s["]+|[\s\]"]+$/g, "");
	// file/d/ID
	const fileMatch = stripped.match(
		/https?:\/\/drive\.google\.com\/file\/d\/([^/?\s]+)(?:\/|$|\?)/,
	);
	if (fileMatch) return fileMatch[1];
	// open?id=ID
	const openMatch = stripped.match(
		/https?:\/\/drive\.google\.com\/open\?id=([^&\s]+)/,
	);
	if (openMatch) return openMatch[1];
	// uc?id=ID (existing format)
	const ucMatch = stripped.match(
		/https?:\/\/drive\.google\.com\/uc\?id=([^&\s]+)/,
	);
	if (ucMatch) return ucMatch[1];
	return null;
}

export const normalizeImageSrc = (raw: string): string => {
	if (!raw) return "";
	const stripped = raw.trim().replace(/^[\s["]+|[\s\]"]+$/g, "");
	const fileId = getDriveFileId(stripped);
	if (fileId) {
		return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${DRIVE_THUMBNAIL_WIDTH}`;
	}
	return stripped;
};

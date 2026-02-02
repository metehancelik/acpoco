import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

function getEnv(name: string): string | undefined {
	const v = process.env[name];
	if (!v) return undefined;
	const trimmed = v.trim();
	return trimmed ? trimmed : undefined;
}

function getUploadDir(): string {
	// Default to a writable path both locally and in containers.
	return getEnv("UPLOAD_DIR") ?? path.join(process.cwd(), "uploads");
}

function contentTypeForExt(ext: string): string {
	switch (ext) {
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".png":
			return "image/png";
		case ".pdf":
			return "application/pdf";
		default:
			return "application/octet-stream";
	}
}

export async function GET(
	_request: Request,
	{ params }: { params: { path: string[] } },
) {
	const parts = params.path ?? [];
	if (parts.length === 0) return new Response("Not found", { status: 404 });
	if (parts.some((p) => p === ".." || p.includes(".."))) {
		return new Response("Not found", { status: 404 });
	}

	const uploadDir = getUploadDir();
	const filePath = path.join(uploadDir, ...parts);
	const resolvedBase = path.resolve(uploadDir);
	const resolvedTarget = path.resolve(filePath);
	if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
		return new Response("Not found", { status: 404 });
	}

	try {
		await access(resolvedTarget);
	} catch {
		return new Response("Not found", { status: 404 });
	}

	const fileStat = await stat(resolvedTarget);
	if (!fileStat.isFile()) return new Response("Not found", { status: 404 });

	const ext = path.extname(resolvedTarget).toLowerCase();
	const ct = contentTypeForExt(ext);
	const headers = new Headers();
	headers.set("Content-Type", ct);
	headers.set("Content-Length", String(fileStat.size));
	headers.set("Cache-Control", "public, max-age=31536000, immutable");

	// PDFs (labels) should download by default.
	if (ext === ".pdf") {
		headers.set(
			"Content-Disposition",
			`attachment; filename="${path.basename(resolvedTarget)}"`,
		);
	}

	const stream = createReadStream(resolvedTarget);
	return new Response(Readable.toWeb(stream) as unknown as BodyInit, { headers });
}


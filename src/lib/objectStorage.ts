import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

function getEnv(name: string): string | undefined {
	const v = process.env[name];
	if (!v) return undefined;
	const trimmed = v.trim();
	return trimmed ? trimmed : undefined;
}

function normalizeBaseUrl(url: string): string {
	return url.replace(/\/+$/, "");
}

function getLocalUploadDir(): string {
	// Default to a writable path both locally and in containers.
	// In Coolify, set UPLOAD_DIR=/app/uploads and mount a persistent volume there.
	return getEnv("UPLOAD_DIR") ?? path.join(process.cwd(), "uploads");
}

function ensureSafeKey(key: string): string {
	const clean = key.replace(/^\/+/, "");
	if (!clean) throw new Error("Invalid object key");
	if (clean.includes("..")) throw new Error("Invalid object key");
	return clean;
}

function getUploadsUrlPrefix(): string {
	return "/uploads/";
}

export function buildPublicObjectUrl(key: string): string {
	const cleanKey = ensureSafeKey(key);

	const base = getEnv("UPLOAD_PUBLIC_BASE_URL");
	const prefix = getUploadsUrlPrefix();
	return base ? `${normalizeBaseUrl(base)}${prefix}${cleanKey}` : `${prefix}${cleanKey}`;
}

export function extractKeyFromPublicObjectUrl(publicUrl: string): string {
	const trimmed = publicUrl.trim();

	// Supports:
	// - https://domain/uploads/a/b.png
	// - /uploads/a/b.png
	try {
		const u = new URL(trimmed);
		const idx = u.pathname.indexOf(getUploadsUrlPrefix());
		if (idx >= 0) return u.pathname.slice(idx + getUploadsUrlPrefix().length);
	} catch {
		// not an absolute URL, continue
	}

	const idx = trimmed.indexOf(getUploadsUrlPrefix());
	if (idx >= 0) return trimmed.slice(idx + getUploadsUrlPrefix().length);

	return "";
}

export async function putObject(params: {
	key: string;
	body: Buffer;
	contentType: string;
	contentDisposition?: string;
}): Promise<{ key: string; publicUrl: string }> {
	const cleanKey = ensureSafeKey(params.key);

	const uploadDir = getLocalUploadDir();
	const filePath = path.join(uploadDir, cleanKey);
	const resolvedBase = path.resolve(uploadDir);
	const resolvedTarget = path.resolve(filePath);
	if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
		throw new Error("Invalid upload path");
	}

	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, params.body);

	return { key: cleanKey, publicUrl: buildPublicObjectUrl(cleanKey) };
}

export async function deleteByPublicUrl(publicUrl: string): Promise<void> {
	const key = extractKeyFromPublicObjectUrl(publicUrl);
	if (!key) return;

	const uploadDir = getLocalUploadDir();
	const filePath = path.join(uploadDir, ensureSafeKey(key));
	try {
		await unlink(filePath);
	} catch {
		// ignore missing files
	}
}


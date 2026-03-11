import logger from "./logger";

interface ErrorContext {
	userId?: string;
	path?: string;
	[key: string]: unknown;
}

export function logError(err: unknown, context?: ErrorContext) {
	const error = err instanceof Error ? err : new Error(String(err));
	logger.error({
		type: "error",
		message: error.message,
		stack: error.stack,
		...context,
	});
}

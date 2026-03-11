import logger from "./logger";

export function logEvent(event: string, metadata?: Record<string, unknown>) {
	logger.info({
		type: "business_event",
		event,
		...metadata,
	});
}

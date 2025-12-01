import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_REMOTE;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

declare global {
	// eslint-disable-next-line no-var
	var _mongoose: {
		conn: mongoose.Mongoose | null;
		promise: Promise<mongoose.Mongoose> | null;
	};
}

let cached = global._mongoose;

if (!cached) {
	cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose.connect(MONGODB_URI!, opts);
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;

import dbConnect from "@/lib/db";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await dbConnect();
      console.warn("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
}

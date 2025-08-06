import { Schema, model, models } from "mongoose";

const LogSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["error", "warn", "info", "verbose", "debug", "silly"],
      default: "info",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "logs",
  },
);

export const LogModel = models.Log || model("Log", LogSchema);

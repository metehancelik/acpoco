import mongoose, { Document, Model } from "mongoose";

export interface IStore extends Document {
  storeId: number;
  storeName: string;
  userId: mongoose.Schema.Types.ObjectId;
  marketplaceId: number;
  marketplaceName: string;
  accountName: string | null;
  email: string | null;
  integrationUrl: string | null;
  active: boolean;
  companyName: string;
  phone: string;
  publicEmail: string;
  website: string;
  refreshDate: Date | null;
  lastRefreshAttempt: Date | null;
  createDate: Date;
  modifyDate: Date;
  autoRefresh: boolean;
  statusMappings: unknown;
}

const StoreSchema = new mongoose.Schema({
  storeId: { required: true, unique: true, type: Number },
  storeName: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  marketplaceId: { type: Number, required: true },
  marketplaceName: { type: String, required: true },
  accountName: { type: String, default: null },
  email: { type: String, default: null },
  integrationUrl: { type: String, default: null },
  active: { type: Boolean, default: true },
  companyName: { type: String, default: "" },
  phone: { type: String, default: "" },
  publicEmail: { type: String, default: "" },
  website: { type: String, default: "" },
  refreshDate: { type: Date, default: null },
  lastRefreshAttempt: { type: Date, default: null },
  createDate: { type: Date, default: Date.now },
  modifyDate: { type: Date, default: Date.now },
  autoRefresh: { type: Boolean, default: true },
  statusMappings: { type: mongoose.Schema.Types.Mixed, default: null },
});

const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default Store;

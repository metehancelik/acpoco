import mongoose, { model, models } from "mongoose";

const WarehouseSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "warehouses",
  },
);

const Warehouse = models.Warehouse || model("Warehouse", WarehouseSchema);

export default Warehouse;

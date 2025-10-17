import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "SELLER", "ADMIN"], default: "USER" },
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BillingAddress",
  },
  createdAt: { type: Date, default: Date.now },
  favorites: [{ type: [mongoose.Schema.Types.ObjectId], ref: "Product" }],
  cart: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
      count: { type: Number, default: 1 },
    },
  ],
  productPriceRate: { type: Number, default: 2 },
  shippingPriceRate: { type: Number, default: 2 },
  warehousePriceRate: { type: Number, default: 2 },
  discountPercent: { type: Number, default: 0 },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
